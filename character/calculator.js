var statistics = { strength: 0, finesse: 0, willpower: 0, instinct: 0, presence: 0, knowledge: 0 };
var attributes = { life: 20, recovery: 10, block: 0, wealth: 'Limited' };
var speeds = { walk: 'Normal', climb: 'N/A', swim: 'N/A', burrow: 'N/A', fly: 'N/A' };

var creation_mode = true;

function modeChange() {
  creation_mode = document.getElementById('mode').checked;

  // If we switched to character creation mode, make sure everything is in range
  if (creation_mode) {
    updateStat(document.getElementById('strength'));
    updateStat(document.getElementById('finesse'));
    updateStat(document.getElementById('willpower'));
    updateStat(document.getElementById('instinct'));
    updateStat(document.getElementById('presence'));
    updateStat(document.getElementById('knowledge'));

    updateAttr(document.getElementById('life'));
    updateAttr(document.getElementById('recovery'));
    updateAttr(document.getElementById('block'));

    validateSpecializations();
    validateExperiences();
    // There are (currently) no restrictions on abilities, so no validation required
    validateCombatStyles();
    validateItems();

    updateXP();
  }
}

function updateStat(src) {
  let val = parseInt(src.value);

  if (val == NaN) {
    val = statistics[src.id];
  } else if (val < -1) {
    val = -1;
  } else if (val > 2 && creation_mode) {
    val = 2;
  } else if (val > 3) {
    val = 3;
  }

  statistics[src.id] = val;
  src.value = val;
}

function statChange(evnt) {
  updateStat(evnt.srcElement);
  updateXP();
}

function updateAttr(src) {
  switch (src.id) {
    case 'life':
      var val = parseInt(src.value);

      if (val == NaN) {
        val = attributes.life;
      } else if (val < 1) {
        val = 1;
      } else if (val > 40 && creation_mode) {
        val = 40;
      }

      attributes.life = val;
      src.value = val;
      break;
    case 'recovery':
      var val = parseInt(src.value);

      if (val == NaN) {
        val = attributes.recovery;
      } else if (val < 1) {
        val = 1;
      } else if (val > 20 && creation_mode) {
        val = 20;
      }

      attributes.recovery = val;
      src.value = val;
      break;
    case 'block':
      var val = parseInt(src.value);

      if (val == NaN) {
        val = attributes.block;
      } else if (val < 0) {
        val = 0;
      } else if (val > 2 && creation_mode) {
        val = 2;
      } else if (val > 5) {
        val = 5;
      }

      attributes.block = val;
      src.value = val;
      break;
    case 'wealth':
      attributes.wealth = src.value;
      break;
  }
}

function attrChange(evnt) {
  updateAttr(evnt.srcElement);
  updateXP();
}

function wealthChange() {
  attributes.wealth = document.getElementById('wealth').value;
  updateXP();
}

function speedChange(evnt) {
  let src = evnt.srcElement;
  speeds[src.id] = src.value;
  updateXP();
}

function updateXP() {
  var xp = 0;
  
  // Calculate XP of basic statistics
  let statXP = function(n) { switch (n) { case -1: return -3; case 0: return 0; case 1: return 3; case 2: return 9; case 3: return 18; }};
  xp += statXP(statistics.strength);
  xp += statXP(statistics.finesse);
  xp += statXP(statistics.willpower);
  xp += statXP(statistics.instinct);
  xp += statXP(statistics.presence);
  xp += statXP(statistics.knowledge);

  // Calculate XP of other attributes
  let lifeXP = function(n) {
    let t = Math.floor(n / 10); // ten's place, used for base cost
    let o = n % 10; // one's place, final adjustment

    if (t == 0) {
      return -30 + 2 * o;
    } else if (t == 1) {
      return -10 + o;
    } else {
      //     costt(t)              + o * costp(t)
      return 5 * (t - 2) * (t - 1) + o * (t - 1);
    }
  };
  xp += lifeXP(attributes.life);

  let recoveryXP = function(n) {
    let t = Math.floor(n / 5); // step on the XP scale
    let o = n % 5; // final adjustment

    if (t == 0) {
      return -30 + 4 * o;
    } else if (t == 1) {
      return -10 + 2 * o;
    } else {
      //     costt(t)              + o * costp(t)
      return 5 * (t - 2) * (t - 1) + o * 2 * (t - 1);
    }
  };
  xp += recoveryXP(attributes.recovery);

  let blockXP = function(n) {
    switch (n) {
      case 0: return 0;
      case 1: return 3;
      case 2: return 9;
      case 3: return 18;
      case 4: return 30;
      case 5: return 45;
    }
  }
  xp += blockXP(attributes.block);

  // Calculate XP of wealth
  let wealthXP = function(w) {
    switch (w) {
      case 'None': return -2;
      case 'Limited': return 0;
      case 'Modest': return 2;
      case 'Comfortable': return 8;
      case 'Luxurious': return 18;
      case 'Aristocratic': return 43;
    }
  };
  xp += wealthXP(attributes.wealth);

  // Calculate XP of other speeds
  let speedXP = function(s, slow) {
    switch (s) {
      case 'N/A': return 0;
      case 'Slow': return slow;
      case 'Normal': return slow + 1;
      case 'Fast': return slow + 2;
    }
  };
  xp += speedXP(speeds.walk, -1);
  xp += speedXP(speeds.climb, 6);
  xp += speedXP(speeds.swim, 6);
  xp += speedXP(speeds.burrow, 10);
  xp += speedXP(speeds.fly, 16);

  xp += specializationsXP();
  xp += experiencesXP();
  xp += abilitiesXP();
  xp += combatStylesXP();
  xp += itemsXP();

  document.getElementById('xp').textContent = xp;
}

function clearChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
