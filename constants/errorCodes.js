const errorCodes = {
  1: "Database Error", // 500 Internal Server Error
  2: "All Fields Must Be Non Empty", // 400 Bad Request
  3: "Internal Server Error", // 500 Internal Server Error
  4: "Authentication Error", // 401 Unauthorized
  5: "Validation Error", // 400 Bad Request
  6: "Registration Error: User Already Exists", // 409 Conflict (or 400 Bad Request)
  7: "User Does Not Exist", // 404 Not Found
  8: "Incorrect OTP", // 401 Unauthorized (or 400 Bad Request)
  9: "Authorization Error: Header Must Be Provided", // 401 Unauthorized (or 400 Bad Request)
  10: "Authorization Error: Invalid Token", // 401 Unauthorized
  11: "Authorization Error: User Email is Not Verified", // 401 Unauthorized (or 403 Forbidden)
  12: "Unauthorized Access: You Are Not Allowed To Perform This Action", // 403 Forbidden
  13: "Bad Request: Quantity Asked For is More Than Availabe",  // 400 Bad Request
  14: "Incorrect Credentials", // 401
  15: "Available quantity and price must be more than 0", // 400
  16: "User not vefified OTP please verify!"
};

export default errorCodes;
