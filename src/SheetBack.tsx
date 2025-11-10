import "./SheetBack.css";
import { NightOrderEntry } from "./types";
import { formatWithMinorWords } from "./utils/minorWordFormatter";

type SheetBackProps = {
  title: string;
  color: string;
  includeMargins: boolean;
  formatMinorWords?: boolean;
  displayNightOrder?: boolean;
  firstNightOrder?: NightOrderEntry[];
  otherNightOrder?: NightOrderEntry[];
};

export const SheetBack = ({
  title,
  color,
  includeMargins,
  formatMinorWords = false,
  displayNightOrder = false,
  firstNightOrder = [],
  otherNightOrder = [],
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
        {displayNightOrder && (
          <>
            <div className="night-order-container">
              <div className="night-order">
                <span>First Night:</span>
                <div className="night-icons">
                  {firstNightOrder.map((char) => (
                    <img src={getImageSrc(char)} class="night-order-icon"></img>
                  ))}
                </div>
              </div>
              <div className="night-order">
                <span>Other Nights:</span>
                <div className="night-icons">
                  {otherNightOrder.map((entry) => (
                    <img
                      src={getImageSrc(entry)}
                      class="night-order-icon"
                    ></img>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className="sheet-back-overlay"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};

function getImageSrc(entry: NightOrderEntry): string | undefined {
  if (typeof entry === "string") {
    return entry === "dawn"
      ? "/images/dawn-icon.png"
      : entry === "dusk"
      ? "/images/dusk-icon.png"
      : entry === "minioninfo"
      ? "/images/minioninfo.png"
      : "/images/demoninfo.png";
  } else {
    return entry.wiki_image;
  }
}
