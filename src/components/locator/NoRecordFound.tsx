import React from "react";

function NoRecordFound({ message = "" }) {
  return (
    <div className="no-record-found">
      {message
        ? message
        : "Sorry we do not have any location in your area, Please check your nearest location."}
    </div>
  );
}

export default NoRecordFound;
