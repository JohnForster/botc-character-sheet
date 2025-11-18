import { CharacterSheet } from "./pages/CharacterSheet";
import { NightSheet } from "./pages/NightSheet";
import { SheetBack } from "./pages/SheetBack";
import { NightOrders, ParsedScript, ScriptOptions } from "./types";
import { groupCharactersByTeam, findJinxes } from "./utils/scriptUtils";

export type FancyDocProps = {
  script: ParsedScript;
  options: ScriptOptions;
  nightOrders: NightOrders;
};

export function FancyDoc({ script, options, nightOrders }: FancyDocProps) {
  return (
    <div className="sheet-wrapper">
      <CharacterSheet
        title={script.metadata?.name || "Custom Script"}
        author={options.showAuthor ? script.metadata?.author : undefined}
        characters={groupCharactersByTeam(script.characters)}
        color={options.color}
        jinxes={
          options.showJinxes
            ? findJinxes(script.characters, options.useOldJinxes)
            : []
        }
        showSwirls={options.showSwirls}
        includeMargins={options.includeMargins}
        solidTitle={options.solidTitle}
        iconScale={options.iconScale}
        appearance={options.appearance}
      />
      <div style="break-after:page;"></div>

      {options.showBackingSheet && (
        <>
          <SheetBack
            title={script.metadata?.name || "Custom Script"}
            color={options.color}
            includeMargins={options.includeMargins}
            firstNightOrder={nightOrders.first}
            otherNightOrder={nightOrders.other}
            formatMinorWords={options.formatMinorWords}
            displayNightOrder={options.displayNightOrder}
          />
          <div style="break-after:page;"></div>
        </>
      )}

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
