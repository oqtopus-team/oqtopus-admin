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

const apiEndpoint = import.meta.env.VITE_APP_API_ENDPOINT;

interface AnnouncementBase {
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

export async function createAnnouncement(announcementsData: AnnouncementsData, idToken: string) {
  await fetch(`${apiEndpoint}/announcements`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      title: announcementsData.title,
      content: announcementsData.content,
      start_time: announcementsData.start_time,
      end_time: announcementsData.end_time,
      publishable: announcementsData.publishable,
    }),
  });
}

export async function getAnnouncements(
  idToken: string,
  { offset, limit, order, currentTime }: OptionalRequestParams = {}
): Promise<Announcement[]> {
  const params = new URLSearchParams();

  if (offset !== undefined) params.append('offset', offset.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  if (currentTime !== undefined) params.append('current_time', currentTime);
  if (order) params.append('order', order);

  try {
    const response = await fetch(`${apiEndpoint}/announcements?${params.toString()}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
    });

    return response.json().then((json) => json.announcements);
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    throw error;
  }
}

export async function getSingleAnnouncement(
  announcementId: string | number,
  idToken: string
): Promise<Announcement> {
  try {
    const response = await fetch(`${apiEndpoint}/announcements/${announcementId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
    });

    return response.json();
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    throw error;
  }
}

export async function editAnnouncement(
  announcementId: string,
  announcementsData: AnnouncementsData,
  idToken: string
) {
  await fetch(`${apiEndpoint}/announcements/${announcementId}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      title: announcementsData.title,
      content: announcementsData.content,
      start_time: announcementsData.start_time,
      end_time: announcementsData.end_time,
      publishable: announcementsData.publishable,
    }),
  });
}

export async function deleteAnnouncement(announcementId: number, idToken: string) {
  try {
    await fetch(`${apiEndpoint}/announcements/${announcementId}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    throw error;
  }
}
