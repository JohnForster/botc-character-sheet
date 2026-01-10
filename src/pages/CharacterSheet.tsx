import { type CSSProperties } from "preact";
import {
  teamColours,
  normalizeColors,
  createGradient,
  createOverlayBackground,
} from "../utils/colours";
import "./CharacterSheet.css";
import { GroupedCharacters, Jinx, ResolvedCharacter } from "../types";
import { FabledOrLoric } from "../utils/fabledOrLoric";
import { JinxesAndSpecial } from "../components/JinxesAndSpecial";
import { getImageUrl, getJinxedCharacters } from "../utils/scriptUtils";

interface CharacterSheetProps {
  title: string;
  author?: string;
  characters: GroupedCharacters;
  color: string | string[];
  jinxes: Jinx[];
  showSwirls?: boolean;
  includeMargins?: boolean;
  solidTitle?: boolean;
  iconScale?: number;
  appearance?: "normal" | "compact" | "super-compact" | "mega-compact";
  fabledOrLoric?: FabledOrLoric[];
  inlineJinxIcons?: boolean;
  bootleggerRules?: string[];
}

export function CharacterSheet({
  title,
  author,
  characters,
  color = "#4a5568",
  jinxes = [],
  showSwirls = true,
  includeMargins = false,
  solidTitle = false,
  iconScale = 1.6,
  appearance = "normal",
  fabledOrLoric = [],
  inlineJinxIcons = false,
  bootleggerRules = [],
}: CharacterSheetProps) {
  const sections = [
    {
      key: "townsfolk",
      title: "Townsfolk",
      chars: characters.townsfolk,
      color: teamColours["townsfolk"],
    },
    {
      key: "outsider",
      title: "Outsiders",
      chars: characters.outsider,
      color: teamColours["outsider"],
    },
    {
      key: "minion",
      title: "Minions",
      chars: characters.minion,
      color: teamColours["minion"],
    },
    {
      key: "demon",
      title: "Demons",
      chars: characters.demon,
      color: teamColours["demon"],
    },
  ].filter((section) => section.chars.length > 0);

  const colors = normalizeColors(color);
  const gradient = createGradient(colors, 20);

  const appearanceClass =
    appearance !== "normal" ? `appearance-${appearance}` : "";
  const sheetClassName = ["character-sheet", appearanceClass]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={sheetClassName}
      id="character-sheet"
      style={
        {
          "--header-gradient": gradient,
          transform: includeMargins ? "scale(0.952)" : undefined,
        } as CSSProperties
      }
    >
      <img
        className="character-sheet-background"
        src="/images/parchment_texture_a4_lightened.jpg"
      ></img>
      <Sidebar color={color} />
      <div className="sheet-content">
        <Header
          showSwirls={showSwirls}
          title={title}
          author={author}
          solidHeader={solidTitle}
        />

        <div className="characters-grid">
          {sections.map((section, i) => (
            <>
              <CharacterSection
                key={section.key}
                title={section.title.toUpperCase()}
                characters={section.chars}
                charNameColor={section.color}
                iconScale={iconScale}
                jinxes={jinxes}
                allCharacters={[
                  ...characters.townsfolk,
                  ...characters.outsider,
                  ...characters.minion,
                  ...characters.demon,
                ]}
                inlineJinxIcons={inlineJinxIcons}
              />
              {i < sections.length - 1 && (
                <img src="/images/divider.png" className="section-divider" />
              )}
            </>
          ))}
          {(jinxes.length > 0 || fabledOrLoric.length > 0) && (
            <>
              <img src="/images/divider.png" className="section-divider" />
              <JinxesAndSpecial
                fabledAndLoric={fabledOrLoric}
                jinxes={jinxes}
                allCharacters={[
                  ...characters.townsfolk,
                  ...characters.outsider,
                  ...characters.minion,
                  ...characters.demon,
                ]}
                bootleggerRules={bootleggerRules}
              />
            </>
          )}
        </div>

        <div className="sheet-footer">
          <span className="asterisk">*</span>Not the first night
        </div>
      </div>
      <div className="author-credit">
        <p>© Steven Medway bloodontheclocktower.com</p>
        <p>Script template by John Forster ravenswoodstudio.xyz</p>
      </div>
    </div>
  );
}

function Header({
  showSwirls,
  title,
  author,
  solidHeader = false,
}: {
  showSwirls: boolean;
  title: string;
  author?: string;
  solidHeader?: boolean;
}) {
  return (
    <>
      <h1 className="sheet-header">
        {showSwirls && (
          <img
            src="/images/black-swirl-divider.png"
            className="swirl-divider"
          ></img>
        )}
        <span
          style={{
            mixBlendMode: solidHeader ? "normal" : "multiply",
          }}
        >
          {title}
        </span>
        {showSwirls && (
          <img
            src="/images/black-swirl-divider.png"
            className="swirl-divider flip"
          ></img>
        )}
      </h1>
      {author && <h2 className="sheet-author">by {author}</h2>}
    </>
  );
}

function Sidebar({ color }: { color: string | string[] }) {
  const overlayBackground = createOverlayBackground(color, 180);
  return (
    <div className="sidebar-container">
      <div className="sidebar-background"></div>
      <div
        className="sidebar-overlay"
        style={{ background: overlayBackground }}
      ></div>
    </div>
  );
}

interface CharacterSectionProps {
  title: string;
  characters: ResolvedCharacter[];
  charNameColor: string;
  iconScale: number;
  jinxes: Jinx[];
  allCharacters: ResolvedCharacter[];
  inlineJinxIcons: boolean;
}

// Threshold to switch from evenly spaced to space-between layout
const BALANCE_POINT = 8;

function CharacterSection({
  title,
  characters,
  charNameColor,
  iconScale,
  jinxes,
  allCharacters: allChars,
  inlineJinxIcons,
}: CharacterSectionProps) {
  const justifyContent =
    characters.length > BALANCE_POINT
      ? "space-between"
      : characters.length % 2 === 0
      ? "space-around"
      : "flex-start";

  const midpoint = calculateMidpoint(characters);

  return (
    <div className="character-section">
      <h2 className="section-title">{title}</h2>
      <div className="character-list">
        <div className="character-column" style={{ justifyContent }}>
          {characters.slice(0, midpoint).map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              color={charNameColor}
              iconScale={iconScale}
              jinxedCharacters={getJinxedCharacters(char, jinxes, allChars)}
              inlineJinxIcons={inlineJinxIcons}
            />
          ))}
        </div>
        <div className="character-column" style={{ justifyContent }}>
          {characters.slice(midpoint, characters.length).map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              color={charNameColor}
              iconScale={iconScale}
              jinxedCharacters={getJinxedCharacters(char, jinxes, allChars)}
              inlineJinxIcons={inlineJinxIcons}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CharacterCardProps {
  character: ResolvedCharacter;
  color: string;
  iconScale: number;
  jinxedCharacters: ResolvedCharacter[];
  inlineJinxIcons: boolean;
}

function CharacterCard({
  character,
  color,
  iconScale,
  jinxedCharacters,
  inlineJinxIcons,
}: CharacterCardProps) {
  const renderAbility = (ability: string) => {
    // Match square brackets at the end of the ability
    const match = ability.match(/^(.*?)(\[.*?\])$/);

    if (match) {
      const [, beforeBrackets, brackets] = match;
      return (
        <>
          {beforeBrackets}
          <strong className="setup-ability">{brackets}</strong>
        </>
      );
    }

    return ability;
  };

  const imageUrl = getImageUrl(character);
  return (
    <div className="character-card">
      <div className="character-icon-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={character.name}
            className="character-icon"
            style={{ scale: iconScale.toString() }}
          />
        ) : (
          <div
            className="character-icon-placeholder"
            style={{ color, scale: iconScale.toString() }}
          >
            {character.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="character-info">
        <h3 className="character-name" style={{ color: color }}>
          {character.name}
          {inlineJinxIcons && jinxedCharacters.length > 0 && (
            <span className="inline-jinx-icons">
              {jinxedCharacters.map((jinxedChar) => {
                const jinxImageUrl = getImageUrl(jinxedChar);
                return jinxImageUrl ? (
                  <img
                    key={jinxedChar.id}
                    src={jinxImageUrl}
                    alt={jinxedChar.name}
                    className="inline-jinx-icon"
                    title={`Jinxed with ${jinxedChar.name}`}
                  />
                ) : (
                  <span
                    key={jinxedChar.id}
                    className="inline-jinx-icon-placeholder"
                    title={`Jinxed with ${jinxedChar.name}`}
                  >
                    {jinxedChar.name.charAt(0)}
                  </span>
                );
              })}
            </span>
          )}
        </h3>
        <p className="character-ability">{renderAbility(character.ability)}</p>
      </div>
    </div>
  );
}

function calculateMidpoint(characters: ResolvedCharacter[]): number {
  const midpoint = Math.ceil(characters.length / 2);

  if (characters.length % 2 === 0 || characters.length <= BALANCE_POINT) {
    return midpoint;
  }
  const leftWeightedMidpoint = midpoint;
  const rightWeightedMidpoint = midpoint - 1;

  const largerFirstHalf = characters.slice(0, leftWeightedMidpoint);
  const largerSecondHalf = characters.slice(rightWeightedMidpoint - 1);

  const totalAbilityLengthFirstHalf = largerFirstHalf.reduce(
    (sum, char) => sum + char.ability.length,
    0
  );
  const totalAbilityLengthSecondHalf = largerSecondHalf.reduce(
    (sum, char) => sum + char.ability.length,
    0
  );

  // Return the midpoint that results in more balanced ability lengths
  return totalAbilityLengthFirstHalf < totalAbilityLengthSecondHalf
    ? leftWeightedMidpoint
    : rightWeightedMidpoint;
}
