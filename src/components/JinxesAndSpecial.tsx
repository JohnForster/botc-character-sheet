import { Jinx, ResolvedCharacter } from "../types";
import { FabledOrLoric } from "../utils/fabledOrLoric";

interface JinxesSectionProps {
  jinxes: Jinx[];
  allCharacters: ResolvedCharacter[];
  fabledAndLoric: FabledOrLoric[];
}

export function JinxesAndSpecial({
  jinxes,
  allCharacters,
  fabledAndLoric,
}: JinxesSectionProps) {
  // Create a map for quick character lookup
  const characterMap = new Map(
    allCharacters.map((char) => [char.id.toLowerCase(), char])
  );

  const useTwoColumns = jinxes.length > 4;
  const midpoint = useTwoColumns ? Math.ceil(jinxes.length / 2) : jinxes.length;

  // If there are fabled/loric in play, we display them in the right hand column
  // If not, we split the jinxes into columns if there are more than four
  // If not, we use a single column
  let leftColumn;
  let rightColumn;
  if (fabledAndLoric.length) {
    leftColumn = jinxes.map((jinx, i) => (
      <JinxItem key={`lc-${i}`} jinx={jinx} charMap={characterMap} />
    ));
    rightColumn = fabledAndLoric.map((fl, i) => (
      <FabledLoricItem key={`rc-${i}`} item={fl} />
    ));
  } else if (useTwoColumns) {
    leftColumn = jinxes
      .slice(0, midpoint)
      .map((jinx, i) => (
        <JinxItem key={`lc-${i}`} jinx={jinx} charMap={characterMap} />
      ));
    rightColumn = jinxes
      .slice(midpoint)
      .map((jinx, i) => (
        <JinxItem key={`rc-${i}`} jinx={jinx} charMap={characterMap} />
      ));
  } else {
    leftColumn = jinxes.map((jinx, i) => (
      <JinxItem key={`lc-${i}`} jinx={jinx} charMap={characterMap} />
    ));
  }

  return (
    <div className="jinxes-section">
      <h2 className="section-title"></h2>

      {rightColumn ? (
        <div className="jinxes-list jinxes-two-columns">
          <div className="jinx-column">{...leftColumn}</div>
          <div className="jinx-column">{...rightColumn}</div>
        </div>
      ) : (
        <div className="jinxes-list">{...leftColumn}</div>
      )}
    </div>
  );
}

type JinxItemProps = {
  charMap: Map<string, ResolvedCharacter>;
  jinx: Jinx;
};

const JinxItem = ({ charMap, jinx }: JinxItemProps) => {
  const char1 = charMap.get(jinx.characters[0]);
  const char2 = charMap.get(jinx.characters[1]);
  return (
    <div className="jinx-item">
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

function FabledLoricItem({ item }: { item: FabledOrLoric }) {
  return (
    <div className="jinx-item loric">
      <div className="loric-spacer"></div>
      {item.image ? (
        <img src={item.image} alt={item.name} className="jinx-icon loric" />
      ) : (
        <div className="jinx-icon-placeholder">{item.name.charAt(0)}</div>
      )}
      <div className="loric-text-container">
        <p className="jinx-text loric-name">{item.name}</p>
        <p className="jinx-text loric-text">{item.note}</p>
      </div>
    </div>
  );
}

function getImageUrl(
  character: Pick<ResolvedCharacter, "image" | "wiki_image">
) {
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
}
