interface NewsData {
  title: string;
  content: string;
  start_time: string;
  end_time: string;
  publishable: boolean;
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

export async function createAnnouncement(newsData: NewsData, idToken: string) {
  await fetch(`${apiEndpoint}/announcements/`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      title: newsData.title,
      content: newsData.content,
      start_time: newsData.start_time,
      end_time: newsData.end_time,
      publishable: newsData.publishable,
    }),
  });
}

export async function getAnnouncements(idToken: string): Promise<Announcement[]> {
  try {
    const response = await fetch(`${apiEndpoint}/announcements/`, {
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

    return response.json()
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    throw error;
  }
}

export async function editAnnouncement(announcementId: string ,newsData: NewsData, idToken: string) {
  await fetch(`${apiEndpoint}/announcements/${announcementId}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      title: newsData.title,
      content: newsData.content,
      start_time: newsData.start_time,
      end_time: newsData.end_time,
      publishable: newsData.publishable,
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
