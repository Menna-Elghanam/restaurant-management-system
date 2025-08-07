export class ApiResponse {
  static success(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  static error(message = 'Error', statusCode = 500) {
    return {
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString()
    };
  }

  static paginated(data, pagination, message = 'Success') {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    };
  }
}