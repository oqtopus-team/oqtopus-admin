import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import BaseLayout from '../common/BaseLayout';
import { ToolbarPlugin } from './ToolbarPlugin';
import EditorPreview from './EditorPreview';
import MarkdownUnorderedListPlugin from './plugins/MarkdownUnorderedListPlugin';
import { Select } from '../common/Select';
import { editorConfig } from './editorSettings';

import './editor.css';
import 'react-datepicker/dist/react-datepicker.css';
import MarkdownOrderedListPlugin from './plugins/MarkdownOrderedListPlugin';
import MarkdownCodeBlockPlugin from './plugins/MarkdownCodeBlockPlugin';
import MarkdownCheckListPlugin from './plugins/MarkdownCheckListPlugin';
import { useAuth } from '../hooks/use-auth';
import { ComposerWrapper } from './ComposerWrapper/ComposerWrapper';
import { createAnnouncement, editAnnouncement, getSingleAnnouncement } from './NewsApi';

const NewsEditor = () => {
  const [postTitle, setPostTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });
  const [publishable, setPublishable] = useState(1);
  const [editorState, setEditorState] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const auth = useAuth();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const params = useParams<{ postId: string }>();

  useEffect(() => {
    if (params.postId === undefined) return;

    async function getAnnouncement() {
      if (params.postId === undefined) return;

      try {
        const announcement = await getSingleAnnouncement(params.postId, auth.idToken);

        setPublishable(announcement.publishable ? 1 : 0);
        setSelectedDate({
          start: new Date(announcement.start_time),
          end: new Date(announcement.end_time),
        });
        setPostTitle(announcement.title);
        setInitialContent(announcement.content);
      } catch (e) {
        console.error('Error fetching announcement:', e);
      }
    }

    getAnnouncement();
  }, [params, auth.idToken]);

  const handleDateChange = (date: Date | null, key: 'start' | 'end') => {
    if (!date) return;

    setSelectedDate({ ...selectedDate, [key]: date });
  };

  const handlePublishableChange = (event: FormEvent<HTMLSelectElement>) => {
    const state = event.currentTarget.value;
    setPublishable(Number(state));
  };

  const handleSavePost = async () => {
    const postData = {
      title: postTitle,
      content: editorState,
      start_time: selectedDate.start.toISOString(),
      end_time: selectedDate.end.toISOString(),
      publishable: Boolean(publishable),
    };

    if(params.postId) {
      await editAnnouncement(params.postId, postData, auth.idToken)
      return
    }

    await createAnnouncement(postData, auth.idToken);
  };

  const handleCancelEdit = () => {
    navigate('/news');
  };

  return (
    <BaseLayout>
      <Stack direction="horizontal" className="mb-3">
        <label htmlFor="publish-date">{t('news.publish_title')}</label>
        <DatePicker
          id="publish-date"
          selected={selectedDate.start}
          onChange={(e) => handleDateChange(e, 'start')}
          dateFormat="dd/MM/yyyy HH:mm"
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          className="form-control editor-datepicker"
        />
        <DatePicker
          id="end-date"
          selected={selectedDate.end}
          onChange={(e) => handleDateChange(e, 'end')}
          dateFormat="dd/MM/yyyy HH:mm"
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          className="form-control editor-datepicker"
        />
        <Select
          value={publishable.toString()}
          onChange={handlePublishableChange}
          className={`editor-publish-state ${publishable ? 'publishable' : 'unpublishable'}`}
        >
          <option value={1}>{t('news.publishable')}</option>
          <option value={0}>{t('news.unpublishable')}</option>
        </Select>
        <Stack direction="horizontal" className="editor-actions">
          <Button disabled={!editorState} variant="outline-primary" onClick={handleSavePost}>
            {t('news.actions.save')}
          </Button>
          <Button variant="outline-danger" onClick={handleCancelEdit}>
            {t('news.actions.cancel')}
          </Button>
        </Stack>
      </Stack>
      <Form.Control
        type="text"
        placeholder={`${t('news.news_title_placeholder')}`}
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        className="title-input"
      ></Form.Control>
      <Stack direction="horizontal" className="align-items-start">
        <LexicalComposer initialConfig={editorConfig}>
          <ComposerWrapper setEditorState={setEditorState} initialContent={initialContent}>
            <div className="editor-container">
              <ToolbarPlugin />
              <Stack
                direction="horizontal"
                className="editor-toolbar align-items-start overflow-hidden"
              >
                <div className="editor-inner">
                  <RichTextPlugin
                    contentEditable={<ContentEditable className="editor-input" />}
                    placeholder={
                      <div className="editor-placeholder">{t('news.news_content_placeholder')}</div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <HistoryPlugin />
                  <ListPlugin />
                </div>
                <EditorPreview />
              </Stack>
            </div>
            <MarkdownUnorderedListPlugin />
            <MarkdownOrderedListPlugin />
            <MarkdownCodeBlockPlugin />
            <MarkdownCheckListPlugin />
          </ComposerWrapper>
        </LexicalComposer>
      </Stack>
    </BaseLayout>
  );
};

export default NewsEditor;
