import React from "react";
type NoRecordFoundProps = {
  message?: string;
};

function NoRecordFound({ message = "" }: NoRecordFoundProps) {
  return (
    <div className="no-record-found">
      {message
        ? message
        : "Sorry we do not have any location in your area, Please check your nearest location."}
    </div>
  );
}

export default NoRecordFound;
