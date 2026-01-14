import { CharacterSheet } from "./pages/CharacterSheet";
import { NightSheet } from "./pages/NightSheet";
import { SheetBack } from "./pages/SheetBack";
import { NightOrders, ParsedScript, ScriptOptions } from "./types";
import { getFabledOrLoric } from "./utils/fabledOrLoric";
import { groupCharactersByTeam, findJinxes } from "./utils/scriptUtils";
import "./FancyDoc.css";
import { InfoSheet } from "./pages/InfoSheet";
import { ScriptCharacter } from "botc-script-checker";

export type FancyDocProps = {
  script: ParsedScript;
  options: ScriptOptions;
  nightOrders: NightOrders;
};

export function FancyDoc({ script, options, nightOrders }: FancyDocProps) {
  const groupedCharacters = groupCharactersByTeam(script.characters);
  const jinxes = options.showJinxes
    ? findJinxes(script.characters, options.useOldJinxes)
    : [];
  const resolvedJinxes = jinxes.map(
    ({ characters: [char1id, char2id], jinx }) => {
      const char1 = script.characters.find((c) => c.id === char1id);
      const char2 = script.characters.find((c) => c.id === char2id);
      return {
        characters: [char1!, char2!] as [ScriptCharacter, ScriptCharacter],
        text: jinx,
      };
    }
  );
  const fabledAndLoric = getFabledOrLoric(script.characters);

  return (
    <div className="sheet-wrapper">
      {Array(options.numberOfCharacterSheets)
        .fill(true)
        .map((_, i) => (
          <div className={i === 0 ? "" : "print-only"}>
            <CharacterSheet
              title={script.metadata?.name || "Custom Script"}
              author={options.showAuthor ? script.metadata?.author : undefined}
              characters={groupedCharacters}
              color={options.color}
              jinxes={jinxes}
              fabledOrLoric={fabledAndLoric}
              showSwirls={options.showSwirls}
              includeMargins={options.includeMargins}
              solidTitle={options.solidTitle}
              iconScale={options.iconScale}
              appearance={options.appearance}
              inlineJinxIcons={options.inlineJinxIcons}
              bootleggerRules={script.metadata?.bootlegger}
            />
            <div style="break-after:page;"></div>

            {options.overleaf === "backingSheet" && (
              <>
                <SheetBack
                  title={script.metadata?.name || "Custom Script"}
                  color={options.color}
                  includeMargins={options.includeMargins}
                  nightOrders={nightOrders}
                  formatMinorWords={options.formatMinorWords}
                  displayNightOrder={options.displayNightOrder}
                  displayPlayerCounts={options.displayPlayerCounts}
                />
                <div style="break-after:page;"></div>
              </>
            )}

            {options.overleaf === "infoSheet" && (
              <>
                <InfoSheet
                  firstNightOrder={nightOrders.first}
                  otherNightOrder={nightOrders.other}
                  includeMargins={options.includeMargins}
                  title={script.metadata?.name || "Custom Script"}
                  color={options.color}
                  bootleggerRules={script.metadata?.bootlegger}
                  jinxes={resolvedJinxes}
                  fabledOrLoric={fabledAndLoric}
                  travellers={groupedCharacters.traveller}
                  showBaseCharacterCounts={options.displayPlayerCounts}
                  displayNightOrder={options.displayNightOrder}
                />
                <div style="break-after:page;"></div>
              </>
            )}
          </div>
        ))}

      {options.showNightSheet && (
        <>
          <NightSheet
            firstNightOrder={nightOrders.first}
            otherNightOrder={nightOrders.other}
            includeMargins={options.includeMargins}
            title={script.metadata?.name || "Custom Script"}
            color={options.color}
          />
          <div style="break-after:page;"></div>
        </>
      )}
    </div>
  );
}
