import "./SheetBack.css";
import { NightOrders } from "../types";
import { formatWithMinorWords } from "../utils/minorWordFormatter";
import { NightOrderPanel } from "../components/NightOrderPanel";
import { PlayerCount } from "../components/PlayerCount";
import { createOverlayBackground } from "../utils/colours";
import { PrintablePage } from "../components/PrintablePage";

type SheetBackProps = {
  title: string;
  color: string | string[];
  includeMargins: boolean;
  formatMinorWords?: boolean;
  displayNightOrder?: boolean;
  displayPlayerCounts?: boolean;
  nightOrders?: NightOrders;
  dimensions: {
    width: number;
    height: number;
    margin: number;
    bleed: number;
  };
};

export const SheetBack = ({
  title,
  color,
  includeMargins,
  formatMinorWords = false,
  displayNightOrder = false,
  nightOrders = { first: [], other: [] },
  displayPlayerCounts = true,
  dimensions,
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

  const overlayBackground = createOverlayBackground(color, 180);

  return (
    <PrintablePage dimensions={dimensions}>
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
          style={{ background: overlayBackground }}
        ></div>

        <div className="back-info-container">
          {displayPlayerCounts && <PlayerCount />}

          {displayNightOrder && <NightOrderPanel nightOrders={nightOrders} />}
        </div>
      </div>
    </PrintablePage>
  );
};
