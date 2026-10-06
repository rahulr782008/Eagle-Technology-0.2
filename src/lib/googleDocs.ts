export interface GoogleDocFile {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface GoogleDocDetail {
  documentId: string;
  title: string;
  bodyText: string;
  revisionId?: string;
}

// 1. List user's Google Docs via Drive API
export async function listGoogleDocs(accessToken: string): Promise<GoogleDocFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.document' and trashed=false");
  const fields = encodeURIComponent('files(id, name, modifiedTime, webViewLink, iconLink)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime desc&pageSize=20`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Google Docs (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

// 2. Fetch specific Google Doc content via Docs API
export async function getGoogleDoc(documentId: string, accessToken: string): Promise<GoogleDocDetail> {
  const url = `https://docs.googleapis.com/v1/documents/${documentId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to read document (${response.status})`);
  }

  const docData = await response.json();

  // Extract raw text from structural elements
  let bodyText = '';
  if (docData.body?.content) {
    for (const elem of docData.body.content) {
      if (elem.paragraph?.elements) {
        for (const pe of elem.paragraph.elements) {
          if (pe.textRun?.content) {
            bodyText += pe.textRun.content;
          }
        }
      }
    }
  }

  return {
    documentId: docData.documentId,
    title: docData.title,
    bodyText,
    revisionId: docData.revisionId,
  };
}

// 3. Create a new Google Doc with content via Docs API
export async function createGoogleDoc(
  title: string,
  initialContent: string,
  accessToken: string
): Promise<{ documentId: string; title: string; webViewLink?: string }> {
  // Step A: Create Document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create Google Doc (${createRes.status})`);
  }

  const createdDoc = await createRes.json();
  const documentId = createdDoc.documentId;

  // Step B: Insert text content if provided
  if (initialContent.trim()) {
    const insertRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: initialContent,
            },
          },
        ],
      }),
    });

    if (!insertRes.ok) {
      console.warn('Could not insert initial text into document');
    }
  }

  return {
    documentId,
    title: createdDoc.title,
    webViewLink: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}

// 4. Delete Google Doc via Drive API (strictly requires explicit confirmation before calling)
export async function deleteGoogleDoc(fileId: string, accessToken: string): Promise<void> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete document (${response.status})`);
  }
}
