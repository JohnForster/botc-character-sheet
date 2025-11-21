import "./SheetBack.css";
import { NightOrders } from "../types";
import { formatWithMinorWords } from "../utils/minorWordFormatter";
import { NightOrderPanel } from "../components/NightOrderPanel";
import { PlayerCount } from "../components/PlayerCount";

type SheetBackProps = {
  title: string;
  color: string;
  includeMargins: boolean;
  formatMinorWords?: boolean;
  displayNightOrder?: boolean;
  displayPlayerCounts?: boolean;
  nightOrders?: NightOrders;
};

export const SheetBack = ({
  title,
  color,
  includeMargins,
  formatMinorWords = false,
  displayNightOrder = false,
  nightOrders = { first: [], other: [] },
  displayPlayerCounts = true,
}: SheetBackProps) => {
  const renderTitle = () => {
    const parts = title.split("&");
    return parts.map((part, partIndex) => (
      <>
        {formatMinorWords ? formatWithMinorWords(part) : part}
        {partIndex < parts.length - 1 && <span className="ampersand">&</span>}
      </>
    ));
  };

  return (
    <div
      className="sheet-backing"
      style={{
        transform: includeMargins ? "scale(0.952)" : undefined,
      }}
    >
      <div className="sheet-background">
        <div className="title-container">
          <h1>{renderTitle()}</h1>
        </div>
      </div>

      <div
        className="sheet-back-overlay"
        style={{ backgroundColor: color }}
      ></div>

      <div className="back-info-container">
        {displayPlayerCounts && <PlayerCount />}

        {displayNightOrder && <NightOrderPanel nightOrders={nightOrders} />}
      </div>
    </div>
  );
};
