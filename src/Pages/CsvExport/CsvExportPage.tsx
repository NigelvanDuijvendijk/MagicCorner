import React, { useCallback, useState } from "react";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";
import { CSVLink, CSVDownload } from "react-csv";
import "./CsvExport.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

// Allowed extensions for input file
const CsvExportPage = () => {
  const [csvData, setCsvdata] = useState([] as String[]);

  function csvToArray(str: any, delimiter = ";") {
    // Split the CSV string on newlines to get an array of rows
    const rows = str.split("\n");

    // Get the headers (first row) and remove it from the array of rows
    const headers = rows.shift().split(delimiter);

    return rows.map((row: string) => {
      const values = row.split(delimiter);
      return headers.reduce((acc: any, header: any, i: any) => {
        acc[header] = values[i];
        return acc;
      }, {});
    });
  }

  const onDrop = useCallback((acceptedFiles: any[]) => {
    acceptedFiles.forEach((file) => {
      if (file.type === "text/csv") {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          // Do whatever you want with the file contents
          let binaryStr = reader.result!.toString();
          binaryStr = binaryStr.replace(/^(.*\r?\n){1}/, "");
          binaryStr = binaryStr.replace("Quantity", "Count");
          binaryStr = binaryStr.replace("Trade Quantity", "Tradelist Count");
          binaryStr = binaryStr.replace("Card Name", "Name");
          binaryStr = binaryStr.replace("Set Code", "Edition");
          binaryStr = binaryStr.replace("Date Bought", "Last Modified");
          binaryStr = binaryStr.replace("Printing", "Foil");
          binaryStr = binaryStr.replace("Card Number", "Collector Number");
          binaryStr = binaryStr.replaceAll("Played", "Damaged");
          binaryStr = binaryStr.replaceAll("Light Played", "Heavily Played");
          binaryStr = binaryStr.replaceAll("Good", "Played");
          binaryStr = binaryStr.replaceAll(
            "Excellent",
            "Good (Lightly Played)"
          );
          binaryStr = binaryStr.replaceAll("NearMint", "Near Mint");
          binaryStr = binaryStr.replaceAll(
            /(?<=\"(.*?)?)[\,]\s(?=(.*?)?\")/g,
            "* "
          );
          binaryStr = binaryStr.replaceAll(",", ";");
          binaryStr = binaryStr.replaceAll("*", ",");
          binaryStr = binaryStr.replaceAll(/"/g, "");
          console.log(csvToArray(binaryStr));
          setCsvdata(csvToArray(binaryStr));
        };
      } else {
        alert("File type not supported");
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="container">
      <div className="dragAndDrop">
        <div {...getRootProps()}>
          {csvData.length == 0 ? (
            <FontAwesomeIcon icon={faFileArrowUp} />
          ) : (
            <FontAwesomeIcon icon={faCheck} />
          )}
          <input {...getInputProps()} />
        </div>
        {csvData.length != 0 && (
          <CSVLink className="convertButton btn btn-primary" data={csvData}>
            Convert
          </CSVLink>
        )}
      </div>
    </div>
  );
};

export default CsvExportPage;
