import pool from "./connection.js";

function executeQuery(query, callback) {
    const result = {
      response: {},
      error: false,
    };
  
    pool.query(query, (err, queryResult, fields) => {
      if (err) {
        console.error("Database error:", err);
        result.error = true;
      } else {
        result.response = queryResult;
        console.log(result);
      }
      // Call the callback function if provided
      if (typeof callback === "function") {
        callback(result);
      }
    });
  
    return result;
}


export default executeQuery;
