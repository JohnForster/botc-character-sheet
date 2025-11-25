import { NightMarker, NightOrderEntry } from "../types";
import { getImageSrc } from "../utils/nightOrder";
import "./NightSheet.css";
import {
  teamColours,
  normalizeColors,
  createGradient,
  createOverlayBackground,
} from "../utils/colours";
import { ComponentChildren } from "preact";

export type NightSheetProps = {
  firstNightOrder: NightOrderEntry[];
  otherNightOrder: NightOrderEntry[];
  includeMargins: boolean;
  title: string;
  color: string | string[];
};

export const NightSheet = (props: NightSheetProps) => {
  return (
    <>
      <InfoSheet {...props}>
        <div className="night-sheet-heading">
          <h3 className="night-title">First Night</h3>
          <h3 className="script-title">{props.title}</h3>
        </div>
        <div className="night-sheet-order">
          {props.firstNightOrder.map((reminder) => (
            <NightSheetEntry entry={reminder} night="first" />
          ))}
        </div>
      </InfoSheet>
      <InfoSheet {...props}>
        <div className="night-sheet-heading">
          <h3 className="night-title">Other Nights</h3>
          <h3 className="script-title">{props.title}</h3>
        </div>
        <div className="night-sheet-order">
          {props.otherNightOrder.map((reminder) => (
            <NightSheetEntry entry={reminder} night="other" />
          ))}
        </div>
      </InfoSheet>
    </>
  );
};

export type InfoSheetProps = {
  includeMargins: boolean;
  color: string | string[];
  children: ComponentChildren;
};

const InfoSheet = (props: InfoSheetProps) => {
  const colors = normalizeColors(props.color);
  const gradient = createGradient(colors, 20);
  const overlayBackground = createOverlayBackground(props.color, 180);

  return (
    <>
      <div
        className="night-sheet"
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
    </>
  );
};

type NightSheetEntryProps = {
  entry: NightOrderEntry;
  night: "first" | "other";
};

const ReminderIcon = () => (
  <img className="reminder-icon" src="/images/reminder.png"></img>
);

export const NightSheetEntry = (props: NightSheetEntryProps) => {
  const src = getImageSrc(props.entry);
  const { reminderText, name } = getReminderText(props.entry, props.night);
  const colour =
    typeof props.entry === "string" ? "#222" : teamColours[props.entry.team];
  if (!reminderText) {
    console.warn("No reminder text found for:", props.entry);
    return <></>;
  }

  const replaceReminders = (str: string) =>
    str.split(":reminder:").map((u, i) => (i % 2 === 0 ? u : <ReminderIcon />));

  const renderText = (text: string) => {
    const withBold = text
      .split("*")
      .map((t, i) => (i % 2 === 0 ? t : <strong>{t}</strong>))
      .map((t) => (typeof t === "string" ? replaceReminders(t) : t));
    return <>{withBold}</>;
  };

  return (
    <div className="night-sheet-entry">
      <img src={src}></img>
      <div className="night-sheet-entry-text">
        <p className="reminder-name" style={{ color: colour }}>
          {name}
        </p>
        <p className="reminder-text">{renderText(reminderText)}</p>
      </div>
    </div>
  );
};

const getReminderText = (entry: NightOrderEntry, night: "first" | "other") => {
  if (typeof entry === "object") {
    const reminderText =
      night === "first" ? entry.firstNightReminder : entry.otherNightReminder;
    const name = entry.name;
    return { reminderText, name };
  } else {
    const reminder = NON_CHARACTER_REMINDERS[entry];
    const reminderText =
      night === "first" ? reminder.first : reminder.other ?? "";
    const name = reminder.name;
    return { reminderText, name };
  }
};

const NON_CHARACTER_REMINDERS: Record<
  NightMarker,
  { first: string; name: string; other?: string }
> = {
  dusk: {
    first: "Start the Night Phase.",
    name: "Dusk",
    other: "Start the Night Phase.",
  },
  dawn: {
    first: "Wait for a few seconds. End the Night Phase.",
    name: "Dawn",
    other: "Wait for a few seconds. End the Night Phase.",
  },
  demoninfo: {
    first:
      "If there are 7 or more players, wake the Demon: Show the *THESE ARE YOUR MINIONS* token. Point to all Minions. Show the *THESE CHARACTERS ARE NOT IN PLAY* token. Show 3 not-in-play good character tokens.",
    name: "Demon Info",
  },
  minioninfo: {
    first:
      "If there are 7 or more players, wake all Minions: Show the *THIS IS THE DEMON* token. Point to the Demon. Show the *THESE ARE YOUR MINIONS* token. Point to the other Minions.",
    name: "Minion Info",
  },
};
