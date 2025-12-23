const offensive_styles = ["Melee", "Ranged", "Simple & Weak", "Complex & Powerful"];
const defensive_styles = ["Evasive", "Armored", "Shielded", "Parry"];
const stats = ["Strength", "Finesse", "Willpower", "Instinct", "Presence", "Knowledge"];

function isOffensive(nm) {
  switch (nm) {
    case 'Melee': case 'Ranged': case 'Simple & Weak': case 'Complex & Powerful':
      return true;
    case 'Evasive': case 'Armored': case 'Shielded': case 'Parry':
      return false;
    default: return false;
  }
}

function isDefensive(nm) {
  switch (nm) {
    case 'Evasive': case 'Armored': case 'Shielded': case 'Parry':
      return true;
    case 'Melee': case 'Ranged': case 'Simple & Weak': case 'Complex & Powerful':
      return false;
    default: return false;
  }
}

var offensives = [];
var defensives = [];

function addOptions(select, options, selected=1, first='') {
  let empty = document.createElement('option');
  empty.setAttribute('disabled', '');
  empty.setAttribute('value', first);
  empty.textContent = first;
  if (selected == 0) {
    empty.setAttribute('selected', '');
  }
  select.appendChild(empty);

  for (const [idx, o] of options.entries()) {
    let option = document.createElement('option');
    option.setAttribute('value', o);
    option.textContent = o;
    if (idx + 1 == selected) {
      option.setAttribute('selected', '');
    }
    select.appendChild(option);
  }
}

function spec_options(select, kind) {
  if (kind != '') {
    addOptions(select, specializations.flatMap((s) => (s.tag == kind ? [s.verb + " " + s.noun] : [])), 0);
  }
}

function die_options(select, kind) {
  switch (kind) {
    case 'Melee':
      addOptions(select, ['d8']);
      break;
    case 'Ranged':
      addOptions(select, ['d6', 'd8']);
      break;
    case 'Simple & Weak':
      addOptions(select, ['d4', 'd6']);
      break;
    case 'Complex & Powerful':
      addOptions(select, ['d10']);
      break;
  }
}

function range_options(select, kind) {
  switch (kind) {
    case 'Melee':
      addOptions(select, ['in hand-to-hand combat', 'just outside the reach of a similarly sized creature']);
      break;
    case 'Ranged':
      addOptions(select, ['within a reasonable distance', 'from an unreasonable distance']);
      break;
    case 'Simple & Weak':
      addOptions(select, ['nearby', 'in hand-to-hand combat', 'within a reasonable distance']);
      break;
    case 'Complex & Powerful':
      addOptions(select, ['from an unreasonable distance*', 'from an unreasonable distance']);
      break;
  }
}

function new_offensive(
  style = { kind: '', stat: '', bonus: 0, experience: '', spec: '', dice: 0, die: '', range: '' }
) {
  let style_div = document.createElement('div');
  style_div.className = "combatStyle";

  // Create the selector drop-down
  let kind = document.createElement('select');

  let kind_empty = document.createElement('option');
  kind_empty.setAttribute("disabled", "");
  kind_empty.setAttribute("value", "");
  kind.appendChild(kind_empty);

  for (const s of offensive_styles) {
    let kind_option = document.createElement('option');
    kind_option.setAttribute("value", s);
    kind_option.textContent = s;
    kind.appendChild(kind_option);
  }

  kind.value = style.kind;
  style_div.appendChild(kind);

  // Add the stat drop down
  let stat = document.createElement('select');
  stat.onchange = function() {
    style.stat = stat.value;
    updateXP();
  };

  let stat_empty = document.createElement('option');
  stat_empty.setAttribute("disabled", "");
  stat_empty.setAttribute("value", "");
  stat.appendChild(stat_empty);

  for (const s of stats) {
    let stat_option = document.createElement('option');
    stat_option.setAttribute("value", s);
    stat_option.textContent = s;
    stat.appendChild(stat_option);
  }

  stat.value = style.stat;
  style_div.appendChild(stat);

  // The items below get updated based on the kind selected

  // Add a bonus field (used for melee and ranged)
  let bonus = document.createElement('input');
  bonus.setAttribute("type", "number");
  bonus.className = "bonus";
  bonus.value = style.bonus;
  bonus.style.display =
    style.kind == 'Melee' || style.kind == 'Ranged' ? 'inline-block' : 'none';
  bonus.onchange = function() {
    let val = parseInt(bonus.value);

    if (val == NaN) {
      val = style.bonus;
    } else if (val < 1) {
      val = 1;
    } else if (val > 2 && creation_mode) {
      val = 2;
    } else if (val > 4) {
      val = 4;
    }

    style.bonus = val;
    bonus.value = val;
    updateXP();
  };
  style_div.appendChild(bonus);

  // Add an experience (for melee and ranged)
  let experience = document.createElement('input');
  experience.setAttribute('type', 'text');
  experience.setAttribute('placeholder', 'Experience');
  experience.value = style.experience;
  experience.style.display =
    style.kind == 'Melee' || style.kind == 'Ranged' ? 'inline-block' : 'none';
  experience.onchange = function() { style.experience = experience.value; };
  style_div.appendChild(experience);

  // Add a specialization field (to select an appropriate specialization)
  let spec = document.createElement('select');
  spec.onchange = function() { style.spec = spec.value; };
  spec.style.display =
    style.kind == 'Simple & Weak' || style.kind == 'Complex & Powerful' ? 'inline-block' : 'none'; 
  spec_options(spec, style.kind);
  spec.value = style.spec;
  style_div.appendChild(spec);

  // Add dice number
  let dice = document.createElement('input');
  dice.setAttribute("type", "number");
  dice.className = "bonus";
  dice.value = style.dice;
  dice.style.display = style.kind == '' ? 'none' : 'inline-block';
  dice.onchange = function() {
    let val = parseInt(dice.value);

    if (val == NaN) {
      val = style.dice;
    } else if (val < 0) {
      val = 0;
    }

    style.dice = val;
    dice.value = val;
    updateXP();
  };
  style_div.appendChild(dice);

  // Add die type
  let die = document.createElement('select');
  die.onchange = function() { style.die = die.value; updateXP(); };
  die.style.display = style.kind == '' ? 'none' : 'inline-block';
  die_options(die, style.kind);
  die.value = style.die;
  style_div.appendChild(die);

  // Add range
  let range = document.createElement('select');
  range.onchange = function() { style.range = range.value; updateXP(); };
  range.style.display = style.kind == '' ? 'none' : 'inline-block';
  range_options(range, style.kind);
  range.value = style.range;
  style_div.appendChild(range);

  kind.onchange = function() {
    style.kind = kind.value;

    // Reset everything 
    style.bonus = 0;
    bonus.value = 0;
    bonus.style.display = 'none';

    style.experience = '';
    experience.value = '';
    experience.style.display = 'none';

    style.spec = '';
    spec.value = '';
    while (spec.firstChild) {
      spec.removeChild(spec.firstChild);
    }
    spec.style.display = 'none';

    style.dice = 0;
    dice.value = 0;
    dice.style.display = 'inline-block';

    style.die = '';
    die.value = '';
    while (die.firstChild) {
      die.removeChild(die.firstChild);
    }
    die.style.display = 'inline-block';

    style.range = '';
    range.value = '';
    while (range.firstChild) {
      range.removeChild(range.firstChild);
    }
    range.style.display = 'inline-block';

    switch (style.kind) {
      case 'Melee':
        style.bonus = 1;
        bonus.value = 1;
        bonus.style.display = 'inline-block';

        experience.style.display = 'inline-block';

        style.die = 'd8';
        addOptions(die, ['d8']);

        style.range = 'in hand-to-hand combat';
        addOptions(range, ['in hand-to-hand combat', 'just outside the reach of a similarly sized creature']);
        break;
      case 'Ranged':
        style.bonus = 1;
        bonus.value = 1;
        bonus.style.display = 'inline-block';

        experience.style.display = 'inline-block';

        style.die = 'd6';
        addOptions(die, ['d6', 'd8']);

        style.range = 'within a reasonable distance';
        addOptions(range, ['within a reasonable distance', 'from an unreasonable distance']);
        break;
      case 'Simple & Weak':
        spec.style.display = 'inline-block';
        addOptions(spec, specializations.flatMap((s) => (s.tag == 'Simple & Weak' ? [s.verb + " " + s.noun] : [] )), 0);

        style.die = 'd4';
        addOptions(die, ['d4', 'd6']);

        style.range = 'nearby';
        addOptions(range, ['nearby', 'in hand-to-hand combat', 'within a reasonable distance']);
        break;
      case 'Complex & Powerful':
        spec.style.display = 'inline-block';
        addOptions(spec, specializations.flatMap((s) => (s.tag == 'Complex & Powerful' ? [s.verb + " " + s.noun] : [] )), 0);

        style.die = 'd10';
        addOptions(die, ['d10']);

        style.range = 'from an unreasonable distance*';
        addOptions(range, ['from an unreasonable distance*', 'from an unreasonable distance']);
        break;
    }

    combatStylesChanged();
    updateXP();
  };

  // Create the delete button
  let del = document.createElement('button');
  del.setAttribute('type', 'button');
  del.onclick = function() { deleteOffensiveStyle(style); };
  del.textContent = 'X';
  style_div.appendChild(del);

  style.div = style_div;
  return style;
}

function addOffensiveStyle() {
  let style = new_offensive();
  offensives.push(style);
  document.getElementById('offensives').append(style.div);
  updateXP();
}

function deleteOffensiveStyle(style) {
  let idx = offensives.indexOf(style);
  offensives.splice(idx, 1); // delete the element
  style.div.remove();
  combatStylesChanged();
  updateXP();
}

function new_defensive(
  style = { kind: '', stat: '', value: 0 }
) {
  let style_div = document.createElement('div');
  style_div.className = "combatStyle";

  // Create the selector drop-down
  let kind = document.createElement('select');

  let kind_empty = document.createElement('option');
  kind_empty.setAttribute("disabled", "");
  kind_empty.setAttribute("value", "");
  kind.appendChild(kind_empty);

  for (const s of defensive_styles) {
    let kind_option = document.createElement('option');
    kind_option.setAttribute("value", s);
    kind_option.textContent = s;
    kind.appendChild(kind_option);
  }

  kind.value = style.kind;
  style_div.appendChild(kind);

  // Add the stat drop down
  let stat = document.createElement('select');
  stat.onchange = function() {
    style.stat = stat.value;
    updateXP();
  };

  let stat_empty = document.createElement('option');
  stat_empty.setAttribute("disabled", "");
  stat_empty.setAttribute("value", "");
  stat.appendChild(stat_empty);

  for (const s of stats) {
    let stat_option = document.createElement('option');
    stat_option.setAttribute("value", s);
    stat_option.textContent = s;
    stat.appendChild(stat_option);
  }

  stat.value = style.stat;
  style_div.appendChild(stat);

  // Add a value field (used for evasive, armored, and shielded but for different purposes)
  let value = document.createElement('input');
  value.setAttribute("type", "number");
  value.className = "bonus";
  value.value = style.value;
  value.style.display = 
    style.kind == 'Evasive' || style.kind == 'Armored' || style.kind == 'Shielded' ? 'inline-block' : 'none';
  value.onchange = function() {
    let val = parseInt(value.value);

    if (val == NaN) {
      val = style.value;
    } else if (val < 1) {
      val = 1;
    } else if (val > 2 && creation_mode) {
      val = 2;
    } else if (style.kind == 'Evasive' && val > 4) {
      val = 4;
    } else if (style.kind == 'Armored' && val > 5) {
      val = 5
    } else if (style.kind == 'Shielded' && val > 2) {
      val = 2;
    }

    style.value = val;
    value.value = val;
    updateXP();
  };
  style_div.appendChild(value);

  kind.onchange = function() {
    style.kind = kind.value;

    // Reset everything 
    style.value = 0;

    value.value = 0;
    value.style.display = 'none';

    switch (style.kind) {
      case 'Evasive': case 'Armored': case 'Shielded':
        value.style.display = 'inline-block';
        style.value = 1;
        value.value = 1;
        break;
      case 'Parry':
        break;
    }

    combatStylesChanged();
    updateXP();
  };

  // Create the delete button
  let del = document.createElement('button');
  del.setAttribute('type', 'button');
  del.onclick = function() { deleteDefensiveStyle(style); };
  del.textContent = 'X';
  style_div.appendChild(del);

  style.div = style_div;
  return style;
}

function addDefensiveStyle() {
  let style = new_defensive();
  defensives.push(style);
  document.getElementById('defensives').append(style.div);
  updateXP();
}

function deleteDefensiveStyle(style) {
  let idx = defensives.indexOf(style);
  defensives.splice(idx, 1); // delete the element
  style.div.remove();
  combatStylesChanged();
  updateXP();
}

function combatBonusXP(n) {
  switch (n) {
    // A non-0 bonus is only possible for Melee & Ranged and a bonus of +1 is free for them, while a bonus of 0 denotes another style
    case 0: case 1: return 0;
    case 2: return 2;
    case 3: return 5;
    case 4: return 9;
    case 5: return 14; // not for attack/defend bonuses but for block bonus
  }
}

function damageDiceXP(n) {
  return 5 * n * (n + 1) / 2;
}

function combatStylesXP() {
  var xp = 0;

  var stat_counts = { Strength: 0, Finesse: 0, Willpower: 0, Instinct: 0, Presence: 0, Knowledge: 0 };

  for (const style of offensives) {
    stat_counts[style.stat] += 1;

    xp += combatBonusXP(style.bonus);
    xp += damageDiceXP(style.dice);

    switch (style.kind) {
      case 'Melee':
        if (style.range == 'just outside the reach of a similarly sized creature') {
          xp += 2;
        }
        break;
      case 'Ranged':
        if (style.range == 'from an unreasonable distance') {
          xp += 2;
        }
        if (style.die == 'd8') {
          xp += 5;
        }
        break;
      case 'Simple & Weak':
        if (style.range == 'in hand-to-hand combat' || style.range == 'within a reasonable distance') {
          xp += 2;
        }
        if (style.die == 'd6') {
          xp += 5;
        }
        break;
      case 'Complex & Powerful':
        if (style.range == 'from an unreasonable distance') {
          xp += 2;
        }
        break;
    }
  }

  for (const style of defensives) {
    stat_counts[style.stat] += 1;

    switch (style.kind) {
      case 'Evasive':
        xp += combatBonusXP(style.value);
        break;
      case 'Armored':
        xp += 3 * combatBonusXP(style.value);
        break;
      case 'Shielded':
        if (style.value == 2) { xp += 2; }
        break;
      case 'Parry':
        break;
    }
  }

  if (offensives.length > 1) { xp += 3 * (offensives.length - 1); }
  if (defensives.length > 1) { xp += 3 * (defensives.length - 1); }

  for (const stat of stats) {
    if (stat_counts[stat] > 1) {
      let n = stat_counts[stat] - 1; // You only pay for the already existing ones
      xp += 3 * n * (n + 1) / 2;
    }
  }

  return xp;
}

// Used when the mode gets changed
// Attack and defend bonuses for Melee, Ranged, and Evasive are capped at 2 while in creation mode
// Bonus to block of Armored is limited to 2 in creation mode
function validateCombatStyles() {
  for (style of offensives) {
    // Since Simple & Weak and Complex & Powerful don't use the bonus, we don't need to check kind
    if (style.bonus > 2 && creation_mode) {
      style.bonus = 2;
      style.div.children[2].value = 2;
    }
  }

  for (style of defensives) {
    // Since Parry doesn't use the value field and Shielded's max value is 2 anyways we don't need to check the kind
    if (style.value > 2 && creation_mode) {
      style.value = 2;
      style.div.children[2].value = 2;
    }
  }
}

// Called when a specialization's verb, noun, or tag is changed so we can
// update the specialization fields of the appropriate offensive styles
function specializationChange() {
  for (style of offensives) {
    if (style.kind == 'Simple & Weak' || style.kind == 'Complex & Powerful') {
      let spec_select = style.div.children[4];
      let selected = spec_select.value;

      let new_options = specializations.flatMap((s) => (s.tag == style.kind ? [s.verb + " " + s.noun] : []));

      while (spec_select.firstChild) { spec_select.removeChild(spec_select.firstChild); }
      addOptions(spec_select, new_options, 0);

      if (new_options.includes(selected)) {
        spec_select.value = selected;
      } else {
        style.spec = '';
      }
    }
  }
}
