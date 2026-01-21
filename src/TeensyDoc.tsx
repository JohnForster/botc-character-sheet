import { ScriptCharacter } from "botc-script-checker";
import { CharacterSheet } from "./pages/CharacterSheet";
import { ParsedScript, ScriptOptions, NightOrders } from "./types";
import { getFabledOrLoric } from "./utils/fabledOrLoric";
import { groupCharactersByTeam, findJinxes } from "./utils/scriptUtils";
import { InfoSheet } from "./pages/InfoSheet";
import { SheetBack } from "./pages/SheetBack";

import "./TeensyDoc.css";
import { NightSheet } from "./pages/NightSheet";

type TeensyDocProps = {
  script: ParsedScript;
  options: ScriptOptions;
  nightOrders: NightOrders;
};

export const TeensyDoc = ({ script, options, nightOrders }: TeensyDocProps) => {
  const numberOfSheets =
    options.numberOfCharacterSheets + (options.numberOfCharacterSheets % 2); // Round up to even number

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
    },
  );

  const fabledAndLoric = getFabledOrLoric(script.characters);
  return (
    <div className="sheet-wrapper teensy">
      {Array.from({ length: numberOfSheets }).map(
        (_, i) =>
          !(i % 2) && (
            <div key={i} className={i === 0 ? "" : "print-only"}>
              <div className="teensy-sheet-pair">
                <CharacterSheet
                  title={script.metadata?.name || "Custom Script"}
                  author={
                    options.showAuthor ? script.metadata?.author : undefined
                  }
                  characters={groupedCharacters}
                  jinxes={jinxes}
                  fabledOrLoric={fabledAndLoric}
                  bootleggerRules={script.metadata?.bootlegger}
                  options={options}
                />
                <CharacterSheet
                  title={script.metadata?.name || "Custom Script"}
                  author={
                    options.showAuthor ? script.metadata?.author : undefined
                  }
                  characters={groupedCharacters}
                  jinxes={jinxes}
                  fabledOrLoric={fabledAndLoric}
                  bootleggerRules={script.metadata?.bootlegger}
                  options={options}
                />
              </div>
              <div style={{ breakAfter: "page" }}></div>
              <div className="teensy-sheet-pair">
                {options.overleaf === "backingSheet" && (
                  <>
                    <SheetBack
                      title={script.metadata?.name || "Custom Script"}
                      nightOrders={nightOrders}
                      options={options}
                    />
                    <SheetBack
                      title={script.metadata?.name || "Custom Script"}
                      nightOrders={nightOrders}
                      options={options}
                    />
                  </>
                )}

                {options.overleaf === "infoSheet" && (
                  <>
                    <InfoSheet
                      title={script.metadata?.name || "Custom Script"}
                      firstNightOrder={nightOrders.first}
                      otherNightOrder={nightOrders.other}
                      bootleggerRules={script.metadata?.bootlegger}
                      jinxes={resolvedJinxes}
                      fabledOrLoric={fabledAndLoric}
                      travellers={groupedCharacters.traveller}
                      options={options}
                    />
                    <InfoSheet
                      title={script.metadata?.name || "Custom Script"}
                      firstNightOrder={nightOrders.first}
                      otherNightOrder={nightOrders.other}
                      bootleggerRules={script.metadata?.bootlegger}
                      jinxes={resolvedJinxes}
                      fabledOrLoric={fabledAndLoric}
                      travellers={groupedCharacters.traveller}
                      options={options}
                    />
                  </>
                )}
              </div>
              {options.showNightSheet && (
                <>
                  <NightSheet
                    title={script.metadata?.name || "Custom Script"}
                    firstNightOrder={nightOrders.first}
                    otherNightOrder={nightOrders.other}
                    options={options}
                  />
                </>
              )}
              {i + 2 < numberOfSheets && <div style="break-after:page;"></div>}
            </div>
          ),
      )}
    </div>
  );
};
