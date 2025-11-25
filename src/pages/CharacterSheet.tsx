import { type CSSProperties } from "preact";
import { darken, teamColours } from "../utils/colours";
import "./CharacterSheet.css";
import { GroupedCharacters, Jinx, ResolvedCharacter } from "../types";
import { FabledOrLoric } from "../utils/fabledOrLoric";
import { JinxesAndSpecial } from "../components/JinxesAndSpecial";

interface CharacterSheetProps {
  title: string;
  author?: string;
  characters: GroupedCharacters;
  color: string;
  jinxes: Jinx[];
  showSwirls?: boolean;
  includeMargins?: boolean;
  solidTitle?: boolean;
  iconScale?: number;
  appearance?: "normal" | "compact" | "super-compact" | "mega-compact";
  fabledOrLoric?: FabledOrLoric[];
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

  const colorDark = darken(color, 0.4);

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
          "--header-color-light": color,
          "--header-color-dark": colorDark,
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
                sidebarColor={color}
                charNameColor={section.color}
                iconScale={iconScale}
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

function Sidebar({ color }: { color: string }) {
  return (
    <div className="sidebar-container">
      <div className="sidebar-background"></div>
      <div className="sidebar-overlay" style={{ backgroundColor: color }}></div>
    </div>
  );
}

interface CharacterSectionProps {
  title: string;
  characters: ResolvedCharacter[];
  sidebarColor: string;
  charNameColor: string;
  iconScale: number;
}

function CharacterSection({
  title,
  characters,
  charNameColor,
  iconScale,
}: CharacterSectionProps) {
  const justifyContent = characters.length > 8 ? "space-between" : "flex-start";

  return (
    <div className="character-section">
      <h2 className="section-title">{title}</h2>
      <div className="character-list">
        <div className="character-column">
          {characters.slice(0, Math.ceil(characters.length / 2)).map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              color={charNameColor}
              iconScale={iconScale}
            />
          ))}
        </div>
        <div className="character-column" style={{ justifyContent }}>
          {characters
            .slice(Math.ceil(characters.length / 2), characters.length)
            .map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                color={charNameColor}
                iconScale={iconScale}
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
}

function CharacterCard({ character, color, iconScale }: CharacterCardProps) {
  const getImageUrl = () => {
    // Prefer wiki_image for official characters
    if (character.wiki_image) {
      return character.wiki_image;
    }
    // Fall back to custom image for custom characters
    if (!character.image) {
      return null;
    }
    if (typeof character.image === "string") {
      return character.image;
    }
    // If it's an array, use the first image
    return character.image[0];
  };

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

  const imageUrl = getImageUrl();

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
        </h3>
        <p className="character-ability">{renderAbility(character.ability)}</p>
      </div>
    </div>
  );
}
