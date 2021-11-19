import axios from 'axios';
import { basicPageGenerateGql } from './gql/pages/basicPageGql.js';

export const sites = `"default"`;

export function getPayloadForSection(handle, params = {}) {
  let query = ``;
  const queryVariables = {};
  let setRoute = null;

  console.log(`Getting routes for: ${handle}`);

  switch (handle) {
    case 'basicPage':
      query = basicPageGenerateGql(params);
      setRoute = (data) => {
        if (data.entryCount) {
          console.log(`Total ${handle}: ${data.entryCount}`);
        }
        return data.entries.map((element) => {
          return {
            route: `/${element.uri}`,
            payload: {
              entry: element,
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
        variables: Object.keys(queryVariables).length ? queryVariables : null,
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
