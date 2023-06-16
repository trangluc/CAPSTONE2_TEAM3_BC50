export class Api {
    getMobile = async () => {
      try {
        const res = await axios({
          url: 'https://64709e433de51400f724a0d2.mockapi.io/mobile',
          method: 'GET',
        });
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
    getMobileById = async (id) => {
      try {
        const res = await axios({
          url: `https://64709e433de51400f724a0d2.mockapi.io/mobile/${id}`,
          method: 'GET',
        });
  
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
  }