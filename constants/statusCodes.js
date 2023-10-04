const statusCodes = {
    1: 500, // Database Error
    2: 400, // All Fields Must Be Non Empty
    3: 500, // Internal Server Error
    4: 401, // Authentication Error
    5: 400, // Validation Error
    6: 409, // Registration Error: User Already Exists
    7: 404, // User Does Not Exist
    8: 401, // Incorrect OTP
    9: 401, // Authorization Error: Header Must Be Provided
    10: 401, // Authorization Error: Invalid Token
    11: 401, // Authorization Error: User Email is Not Verified
    12: 403, // Forbidden: Unauthorized Access 
    13: 400, // Bad Request: Quantity Asked For is More Than Availabe
    14: 401, // Incorrect Credentials
    15: 400, // Incorrect Credentials
    16: 200, // OTP Verification Required
  };
  
  export default statusCodes;
  