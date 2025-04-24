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
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
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

type Publishable = 'publishable' | 'unpublishable';

const NewsEditor = () => {
  const [postTitle, setPostTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [publishable, setPublishable] = useState<Publishable>('publishable');
  const { t } = useTranslation();

  const navigate = useNavigate();
  const params = useParams<{ postId: string }>();

  useEffect(() => {
    //TODO: Make load Post data, while page loaded (postId exist)
  }, [params]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    setSelectedDate(date);
  };

  const handlePublishableChange = (event: FormEvent<HTMLSelectElement>) => {
    const state = event.currentTarget.value as Publishable;
    setPublishable(state);
  };

  const handleSavePost = () => {
    console.log('Save post');
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
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            className="form-control editor-datepicker"
          />
          <Select
            value={publishable}
            onChange={handlePublishableChange}
            className={`editor-publish-state ${publishable}`}
          >
            <option value="publishable">{t('news.publishable')}</option>
            <option value="unpublishable">{t('news.unpublishable')}</option>
          </Select>
          <Stack direction="horizontal" className="editor-actions">
            <Button variant="outline-primary" onClick={handleSavePost}>
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
                  <CheckListPlugin />
                </div>
                <EditorPreview />
              </Stack>
            </div>
            <MarkdownUnorderedListPlugin />
            <MarkdownOrderedListPlugin />
            <MarkdownCodeBlockPlugin />
          </LexicalComposer>
        </Stack>
    </BaseLayout>
  );
};

export default NewsEditor;
