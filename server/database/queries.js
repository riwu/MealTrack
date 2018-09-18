const mysql = require('promise-mysql');

const conn = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: 'consumption',
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
});

module.exports = {
  addConsumption: async (flightNo, timestamp, items) => {
    const connection = await conn.getConnection();
    try {
      await connection.beginTransaction();

      const { insertId } = await connection.query('INSERT INTO flight SET ?', {
        number: flightNo,
        timestamp,
      });

      const values = items.map(() => `(?, ?, ${insertId})`).join(',');
      await connection.query(
        `INSERT INTO consumption (name, qty, flight_id) VALUES ${values}`,
        items.reduce((acc, item) => {
          acc.push(item.name);
          acc.push(item.qty);
          return acc;
        }, []),
      );

      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  },
};
