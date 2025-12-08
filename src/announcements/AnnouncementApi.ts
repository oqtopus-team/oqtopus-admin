import { useContext } from 'react';
import { userApiContext } from '../backend/Provider';
import {
  GetAnnouncementsListOrderEnum,
  AnnouncementsGetAnnouncementResponse,
} from '../api/generated';

interface AnnouncementsData {
  title: string;
  content: string;
  start_time: string;
  end_time: string;
  publishable: boolean;
}

interface OptionalRequestParams {
  offset?: number;
  limit?: number;
  order?: string;
  currentTime?: string;
}

export interface AnnouncementBase {
  title: string;
  content: string;
  start_time: string;
  end_time: string;
  updated_at: string;
  publishable: boolean;
}

export interface Announcement extends AnnouncementBase {
  id: number;
}

const convertToGetAnnouncementsListOrderEnum = (
  order?: string
): GetAnnouncementsListOrderEnum | undefined => {
  if (!order) return undefined;

  if (order === 'asc') {
    return GetAnnouncementsListOrderEnum.Asc;
  } else if (order === 'desc') {
    return GetAnnouncementsListOrderEnum.Desc;
  } else {
    return undefined;
  }
};

const correctIdType = (id: string | number): number => {
  return typeof id === 'string' ? Number(id) : id;
};

const convertToAnnouncement = (data: AnnouncementsGetAnnouncementResponse): Announcement => ({
  id: data.id,
  title: data.title,
  content: data.content,
  start_time: data.start_time,
  end_time: data.end_time,
  updated_at: data.updated_at,
  publishable: data.publishable,
});

export const useAnnouncementAPI = () => {
  const api = useContext(userApiContext);

  const createAnnouncement = async (announcementsData: AnnouncementsData) => {
    await api.announcements.announcement(announcementsData);
  };

  const getAnnouncements = async (params: OptionalRequestParams): Promise<Announcement[]> => {
    try {
      const res = await api.announcements.getAnnouncementsList(
        params.offset?.toString(),
        params.limit?.toString(),
        convertToGetAnnouncementsListOrderEnum(params.order),
        params.currentTime
      );
      return (res.data.announcements ?? []).map(convertToAnnouncement);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      throw error;
    }
  };

  const getSingleAnnouncement = async (id: string | number): Promise<Announcement | null> => {
    try {
      const res = await api.announcements.getAnnouncement(correctIdType(id));
      return res.data ? convertToAnnouncement(res.data) : null;
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      throw error;
    }
  };

  const editAnnouncement = async (
    announcementId: string | number,
    announcementsData: AnnouncementsData
  ) => {
    await api.announcements.updateAnnouncement(correctIdType(announcementId), announcementsData);
  };

  const deleteAnnouncement = async (announcementId: string | number) => {
    try {
      await api.announcements.deleteAnnouncement(correctIdType(announcementId));
      return true;
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      throw error;
    }
  };

  return {
    createAnnouncement,
    getAnnouncements,
    getSingleAnnouncement,
    editAnnouncement,
    deleteAnnouncement,
  };
};
