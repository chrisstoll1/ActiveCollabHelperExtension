/* global chrome */
export function formatUnixTimestamp(timestamp) {
    var date = new Date(timestamp * 1000);
    var month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();
  
    if (month.length < 2) 
      month = '0' + month;
    if (day.length < 2) 
      day = '0' + day;
  
    return [month, day, year].join('/');
}