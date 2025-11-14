import { type CSSProperties } from "preact";
import { darken, teamColours } from "./colours";
import "./CharacterSheet.css";
import { GroupedCharacters, Jinx, ResolvedCharacter } from "./types";

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
  appearance?: "normal" | "compact" | "super-compact";
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

  return (
    <div
      className="character-sheet"
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
                appearance={appearance}
              />
              {i < sections.length - 1 && (
                <img src="/images/divider.png" className="section-divider" />
              )}
            </>
          ))}
          {jinxes.length > 0 && (
            <>
              <img src="/images/divider.png" className="section-divider" />
              <JinxesSection
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
  console.log("title:", title);
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
  appearance?: "normal" | "compact" | "super-compact";
}

function CharacterSection({
  title,
  characters,
  charNameColor,
  iconScale,
  appearance = "normal",
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
              appearance={appearance}
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
                appearance={appearance}
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
  appearance?: "normal" | "compact" | "super-compact";
}

function CharacterCard({
  character,
  color,
  iconScale,
  appearance = "normal",
}: CharacterCardProps) {
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

  const cardClass =
    appearance !== "normal" ? `character-card ${appearance}` : "character-card";
  const iconClass =
    appearance === "super-compact"
      ? "character-icon super-compact"
      : "character-icon";
  const iconPlaceholderClass =
    appearance === "super-compact"
      ? "character-icon-placeholder super-compact"
      : "character-icon-placeholder";
  const nameClass =
    appearance === "super-compact"
      ? "character-name super-compact"
      : "character-name";
  const abilityClass =
    appearance === "super-compact"
      ? "character-ability super-compact"
      : "character-ability";

  return (
    <div className={cardClass}>
      <div className="character-icon-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={character.name}
            className={iconClass}
            style={{ scale: iconScale.toString() }}
          />
        ) : (
          <div
            className={iconPlaceholderClass}
            style={{ color, scale: iconScale.toString() }}
          >
            {character.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="character-info">
        <h3 className={nameClass} style={{ color: color }}>
          {character.name}
        </h3>
        <p className={abilityClass}>{renderAbility(character.ability)}</p>
      </div>
    </div>
  );
}

interface JinxesSectionProps {
  jinxes: Jinx[];
  allCharacters: ResolvedCharacter[];
}

function JinxesSection({ jinxes, allCharacters }: JinxesSectionProps) {
  // Create a map for quick character lookup
  const characterMap = new Map(
    allCharacters.map((char) => [char.id.toLowerCase(), char])
  );

  const getImageUrl = (character: ResolvedCharacter) => {
    if (character.wiki_image) {
      return character.wiki_image;
    }
    if (!character.image) {
      return null;
    }
    if (typeof character.image === "string") {
      return character.image;
    }
    return character.image[0];
  };

  const renderJinxItem = (jinx: Jinx, i: number) => {
    const char1 = characterMap.get(jinx.characters[0]);
    const char2 = characterMap.get(jinx.characters[1]);

    return (
      <div key={i} className="jinx-item">
        <div className="jinx-icons">
          {char1 && (
            <div className="jinx-icon-wrapper">
              {getImageUrl(char1) ? (
                <img
                  src={getImageUrl(char1)!}
                  alt={char1.name}
                  className="jinx-icon"
                />
              ) : (
                <div className="jinx-icon-placeholder">
                  {char1.name.charAt(0)}
                </div>
              )}
            </div>
          )}
          <span className="jinx-divider"></span>
          {char2 && (
            <div className="jinx-icon-wrapper">
              {getImageUrl(char2) ? (
                <img
                  src={getImageUrl(char2)!}
                  alt={char2.name}
                  className="jinx-icon"
                />
              ) : (
                <div className="jinx-icon-placeholder">
                  {char2.name.charAt(0)}
                </div>
              )}
            </div>
          )}
        </div>
        <p className="jinx-text">{jinx.jinx}</p>
      </div>
    );
  };

  const useTwoColumns = jinxes.length > 4;
  const midpoint = useTwoColumns ? Math.ceil(jinxes.length / 2) : jinxes.length;
  const leftColumn = jinxes.slice(0, midpoint);
  const rightColumn = jinxes.slice(midpoint);

  return (
    <div className="jinxes-section">
      <h2 className="section-title"></h2>
      {useTwoColumns ? (
        <div className="jinxes-list jinxes-two-columns">
          <div className="jinx-column">
            {leftColumn.map((jinx, i) => renderJinxItem(jinx, i))}
          </div>
          <div className="jinx-column">
            {rightColumn.map((jinx, i) => renderJinxItem(jinx, midpoint + i))}
          </div>
        </div>
      ) : (
        <div className="jinxes-list">
          {jinxes.map((jinx, i) => renderJinxItem(jinx, i))}
        </div>
      )}
    </div>
  );
}
