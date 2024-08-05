interface Response {
    status: string,
    message: string,
    path: string,
    timestamp: string
}

export interface DataResponse extends Response{
    data: any
}
  
export interface ErrorResponse extends Response{
    errors: any;
}