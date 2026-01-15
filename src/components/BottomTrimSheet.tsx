import { ComponentChildren } from "preact";
import {
  normalizeColors,
  createGradient,
  createOverlayBackground,
} from "../utils/colours";
import "./BottomTrimSheet.css";
import { PrintablePage } from "./PrintablePage";
import { PageDimensions } from "../types";

export type BottomTrimSheetProps = {
  includeMargins: boolean;
  color: string | string[];
  dimensions: PageDimensions;
  children: ComponentChildren;
};

export const BottomTrimSheet = (props: BottomTrimSheetProps) => {
  const colors = normalizeColors(props.color);
  const gradient = createGradient(colors, 20);
  const overlayBackground = createOverlayBackground(props.color, 180);

  return (
    <PrintablePage dimensions={props.dimensions}>
      <div
        className="bottom-trim-sheet"
        style={{
          transform: props.includeMargins ? "scale(0.952)" : undefined,
          "--header-gradient": gradient,
        }}
      >
        <img
          className="character-sheet-background"
          src="/images/parchment_texture_a4_lightened.jpg"
        ></img>
        <div className="sheet-content">{props.children}</div>
        <div className="spacer"></div>
        <div className="info-footer-container">
          <div className="info-author-credit">
            <p>© Steven Medway bloodontheclocktower.com</p>
            <p>Script template by John Forster ravenswoodstudio.xyz</p>
          </div>
          <div className="info-footer-background"></div>
          <div
            className="info-footer-overlay"
            style={{ background: overlayBackground }}
          ></div>
        </div>
      </div>
    </PrintablePage>
  );
};
