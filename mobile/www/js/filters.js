angular.module("starter.filters", [])

.filter("dateTime", function (moment) {
  return function (dateString) {
    var dt;

    if (!dateString) { return; }

    dt = moment(dateString);

    if (!dt.isValid()) { return; }

    return dt.format("lll");
  };
})
;
