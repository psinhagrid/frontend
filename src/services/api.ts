const API_BASE_URL = 'http://localhost:8000'; // Replace with your actual API base URL

export const createSession = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/agent/create_session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.session_id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }
};

export const sendQuery = async (
  query: string,
  sessionId: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/agent/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        thinking: true,
        codeact_enable: true,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'No response received';
  } catch (error) {
    console.error('Error sending query:', error);
    throw new Error('Failed to send message');
  }
};