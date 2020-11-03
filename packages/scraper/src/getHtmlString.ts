import axios from 'axios';

const getHtmlString = async (url: string): Promise<string> => {
  try {
    const response = await axios({
      url,
      method: 'get',
      responseType: 'text',
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return '';
  }
};

export default getHtmlString;
