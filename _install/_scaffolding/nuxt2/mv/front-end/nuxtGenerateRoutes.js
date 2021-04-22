import axios from 'axios';
import { articleGenerateGql } from './gql/pages/articleGql.js';

function getGlobalsForElement(globals, element) {
  return {
    // payload objects
  };
}

export function getPayloadForSection(handle, globals = null, params = {}) {
  let query = ``;
  let setRoute = null;

  console.log(`Getting routes for: ${handle}`);

  switch (handle) {
    case 'globals':
      query = `query {}`;
      setRoute = (data) => {
        return data;
      };
      break;
    case 'article':
      query = articleGenerateGql(params);
      setRoute = (data) => {
        if (data.entryCount) {
          console.log(`Total ${handle}: ${data.entryCount}`);
        }
        return data.entries.map((element) => {
          return {
            route: `/${element.uri}`,
            payload: {
              entry: element,
              ...getGlobalsForElement(globals, element),
            },
          };
        });
      };
      break;
  }

  return axios
    .post(
      process.env.CRAFT_API_URL,
      {
        query,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CRAFT_AUTH_TOKEN}`,
        },
      }
    )
    .then((res) => {
      if (res.data?.data) {
        return setRoute(res.data.data);
      } else {
        console.log(res.data);
        console.log(res.data.errors[0].locations);
      }
    });
}
