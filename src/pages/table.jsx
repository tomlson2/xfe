import React, { useState, useEffect, useRef } from "react";

const Table = ({ data }) => {
  const desiredRows = 20;
  const [sortColumn, setSortColumn] = useState("new_alloc"); // Update default sort column
  const [sortDirection, setSortDirection] = useState("desc"); // Update default sort direction
  const [rowsToShow, setRowsToShow] = useState(desiredRows);
  const baseURL = "https://unisat.io/brc20?q=";

  const tableContainerRef = useRef(null);
  const [maxLength, setMaxLength] = useState(30); // Dynamic maximum length based on available space

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (typeof aValue === "number" && typeof bValue === "number") {
        if (sortDirection === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else {
        if (sortDirection === "asc") {
          return String(aValue).localeCompare(String(bValue));
        } else {
          return String(bValue).localeCompare(String(aValue));
        }
      }
    }
    return 0;
  });

  const handleClickShowMore = () => {
    setRowsToShow((prevRowsToShow) => prevRowsToShow + desiredRows);
  };

  const handleClickShowLess = () => {
    setRowsToShow((prevRowsToShow) => Math.max(prevRowsToShow - desiredRows, desiredRows));
  };

  // these buttons now only appear if there is more data to be shown
  const showMoreButton =
    rowsToShow !== sortedData.length && sortedData.length > desiredRows ? (
      <button onClick={handleClickShowMore}>Show More</button>
    ) : null;

    const showLessButton =
    rowsToShow > desiredRows ? (
      <button onClick={handleClickShowLess}>Show Less</button>
    ) : null;

  useEffect(() => {
    const calculateMaxLength = () => {
      const tableContainerWidth = tableContainerRef.current.offsetWidth;
      const columnCount = 4; // Assuming 4 columns
      const padding = 20; // Adjust padding as needed
      const availableSpace = tableContainerWidth / columnCount - padding;
      setMaxLength(Math.floor(availableSpace / 9)); // Adjust the division value as needed to achieve desired length
    };

    window.addEventListener("resize", calculateMaxLength);
    calculateMaxLength();

    return () => {
      window.removeEventListener("resize", calculateMaxLength);
    };
  }, []);

  const isSmallScreen = window.innerWidth <= 600;

  return (
    <div ref={tableContainerRef} class="table-container">
          <table>
    <thead>
    <tr>
          <th
            onClick={() => handleSort("address")}
            data-header="Addr"
            className={isSmallScreen ? "small-header" : ""}
          >
            {isSmallScreen ? "Address" : "Address"}
          </th>
          <th
            onClick={() => handleSort("og_alloc")}
            data-header="100k"
            className={isSmallScreen ? "small-header" : ""}
          >
            {isSmallScreen ? "100k holds" : "100k Holdings"}
          </th>
          <th
            onClick={() => handleSort("new_alloc")}
            data-header="10k"
            className={isSmallScreen ? "small-header" : ""}
          >
            {isSmallScreen ? "$XMYR Alloc" : "$XMYR Allocation"}
          </th>
          {/* <th
            onClick={() => handleSort("burn")}
            data-header="Burn"
            className={isSmallScreen ? "small-header" : ""}
          >
            {isSmallScreen ? "Burn" : "Burn Bonus"}
          </th> */}
        </tr>
    </thead>
    <tbody>
      {sortedData.slice(0, rowsToShow).map((item, index) => (
        <tr key={item.id} className={index % 2 === 0 ? "even" : "odd"}>
          <td>
            <a
              href={baseURL + item.address}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "inline-block",
                maxWidth: "100%",
                overflow: "visible",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.address.length > maxLength
                ? `${item.address.substr(0, maxLength / 2)}...${item.address.substr(
                    -maxLength / 2
                  )}`
                : item.address}
            </a>
          </td>
          <td>{item.og_alloc}</td>
          <td>{item.new_alloc}</td>
          <td>{item.burn}</td>
        </tr>
      ))}
    </tbody>
  </table>
        <div class="button-container">
            {showMoreButton}
            {showLessButton}
        </div>
    </div>
  );
};

export default Table;
