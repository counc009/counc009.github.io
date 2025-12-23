const relic_addon_options = ['Ability', 'Attribute', 'Block', 'Experience', 'Life', 'Recovery', 'Specialization']
const offensive_addon_options = ['Ability', 'Attribute', 'Block', 'Experience', 'Life', 'Recovery', 'Specialization', 'Style']
const defensive_addon_options = ['Ability', 'Attribute', 'Experience', 'Life', 'Recovery', 'Specialization', 'Style']

var items = [];

function new_weapon_style(res = { style: '' }) {
  let style = document.createElement('select');
  addOptions(style, offensives.map((s) => (s.kind)).concat(defensives.map((s) => (s.kind))), 0);
  style.value = res.style;
  style.onchange = function() { res.style = style.value; };

  res.div = style;
  return res;
}

// The optional argument addon is used to build from an existing addon
function new_addon(kind, addons_lst, addons_div, addon) {
  switch (kind) {
    case 'Ability':
      let ability = new_ability((ability) =>
        (() => {
          let idx = addons_lst.indexOf(ability);
          addons_lst.splice(idx, 1);
          ability.div.remove();
          updateXP();
        }), addon);
      ability.addon_kind = 'Ability';

      addons_div.appendChild(ability.div);
      addons_lst.push(ability);
      break;
    case 'Attribute':
      if (addon == null) {
        addon = { addon_kind: 'Attribute', stat: '', bonus: 0 };
      }

      let attribute_div = document.createElement('div');

      let attribute_select = document.createElement('select');
      addOptions(attribute_select, stats, selected=0);
      attribute_select.value = addon.stat;
      attribute_select.onchange = function() { addon.stat = attribute_select.value; };
      attribute_div.appendChild(attribute_select);

      let attribute_bonus = document.createElement('input');
      attribute_bonus.setAttribute('type', 'number');
      attribute_bonus.className = 'bonus';
      attribute_bonus.value = addon.bonus;
      attribute_bonus.onchange = function() {
        let val = parseInt(attribute_bonus.value);

        if (val == NaN) {
          val = addon.bonus;
        } else if (val < 0) {
          val = 0;
        } else if (val > 2 && creation_mode){
          val = 2;
        } else if (val > 3) {
          val = 3;
        }

        addon.bonus = val;
        attribute_bonus.value = val;
        updateXP();
      };
      attribute_div.appendChild(attribute_bonus);

      let attribute_del = document.createElement('button');
      attribute_del.setAttribute('type', 'button');
      attribute_del.textContent = 'X';
      attribute_del.onclick = function() {
        let idx = addons_lst.indexOf(addon);
        addons_lst.splice(idx, 1);
        attribute_div.remove();
        updateXP();
      };
      attribute_div.appendChild(attribute_del);

      addon.div = attribute_div;
      addons_div.appendChild(attribute_div);
      addons_lst.push(addon);
      break;
    case 'Block':
      if (addon == null) {
        addon = { addon_kind: 'Block', bonus: 0 };
      }

      let block_div = document.createElement('div');

      let block_label = document.createElement('b');
      block_label.textContent = 'Block ';
      block_div.appendChild(block_label);

      let block_bonus = document.createElement('input');
      block_bonus.setAttribute('type', 'number');
      block_bonus.className = 'bonus';
      block_bonus.value = addon.bonus;
      block_bonus.onchange = function() {
        let val = parseInt(block_bonus.value);

        if (val == NaN) {
          val = addon.bonus;
        } else if (val < 0) {
          val = 0;
        } else if (val > 2 && creation_mode) {
          val = 2;
        } else if (val > 3) {
          val = 3;
        }

        addon.bonus = val;
        block_bonus.value = val;
        updateXP();
      };
      block_div.appendChild(block_bonus);

      let block_del = document.createElement('button');
      block_del.setAttribute('type', 'button');
      block_del.textContent = 'X';
      block_del.onclick = function() {
        let idx = addons_lst.indexOf(addon);
        addons_lst.splice(idx, 1);
        block_div.remove();
        updateXP();
      };
      block_div.appendChild(block_del);

      addon.div = block_div;
      addons_div.appendChild(block_div);
      addons_lst.push(addon);
      break;
    case 'Experience':
      let exp = new_experience((exp) =>
        (() => {
          let idx = addons_lst.indexOf(exp);
          addons_lst.splice(idx, 1);
          exp.div.remove();
          updateXP();
        }), addon);
      exp.addon_kind = 'Experience';

      addons_div.appendChild(exp.div);
      addons_lst.push(exp);
      break;
    case 'Life':
      if (addon == null) {
        addon = { addon_kind: 'Life', bonus: 0 };
      }

      let life_div = document.createElement('div');

      let life_label = document.createElement('b');
      life_label.textContent = 'Life ';
      life_div.appendChild(life_label);

      let life_bonus = document.createElement('input');
      life_bonus.setAttribute('type', 'number');
      life_bonus.className = 'bonus';
      life_bonus.value = addon.bonus;
      life_bonus.onchange = function() {
        let val = parseInt(life_bonus.value);

        if (val == NaN) {
          val = addon.bonus;
        } else if (val < 0) {
          val = 0;
        } else if (val > 10) {
          val = 10;
        }

        addon.bonus = val;
        life_bonus.value = val;
        updateXP();
      };
      life_div.appendChild(life_bonus);

      let life_del = document.createElement('button');
      life_del.setAttribute('type', 'button');
      life_del.textContent = 'X';
      life_del.onclick = function() {
        let idx = addons_lst.indexOf(addon);
        addons_lst.splice(idx, 1);
        life_div.remove();
        updateXP();
      };
      life_div.appendChild(life_del);

      addon.div = life_div;
      addons_div.appendChild(life_div);
      addons_lst.push(addon);
      break;
    case 'Recovery':
      if (addon == null) {
        addon = { addon_kind: 'Recovery', bonus: 0 };
      }

      let recovery_div = document.createElement('div');

      let recovery_label = document.createElement('b');
      recovery_label.textContent = 'Recovery ';
      recovery_div.appendChild(recovery_label);

      let recovery_bonus = document.createElement('input');
      recovery_bonus.setAttribute('type', 'number');
      recovery_bonus.className = 'bonus';
      recovery_bonus.value = addon.bonus;
      recovery_bonus.onchange = function() {
        let val = parseInt(recovery_bonus.value);

        if (val == NaN) {
          val = addon.bonus;
        } else if (val < 0) {
          val = 0;
        } else if (val > 5) {
          val = 5;
        }

        addon.bonus = val;
        recovery_bonus.value = val;
        updateXP();
      };
      recovery_div.appendChild(recovery_bonus);

      let recovery_del = document.createElement('button');
      recovery_del.setAttribute('type', 'button');
      recovery_del.textContent = 'X';
      recovery_del.onclick = function() {
        let idx = addons_lst.indexOf(addon);
        addons_lst.splice(idx, 1);
        recovery_div.remove();
        updateXP();
      };
      recovery_div.appendChild(recovery_del);

      addon.div = recovery_div;
      addons_div.appendChild(recovery_div);
      addons_lst.push(addon);
      break;
    case 'Specialization':
      let spec = new_spec((spec) =>
        (() => {
          let idx = addons_lst.indexOf(spec);
          addons_lst.splice(idx, 1);
          spec.div.remove();
          updateXP();
        }), addon);
      spec.addon_kind = 'Specialization';

      addons_div.appendChild(spec.div);
      addons_lst.push(spec);
      break;
    case 'Style':
      let style = new_weapon_style(addon);
      style.addon_kind = 'Style';

      let style_div = document.createElement('div');
      style_div.appendChild(style.div);
      style.div = style_div;

      let style_del = document.createElement('button');
      style_del.setAttribute('type', 'button');
      style_del.textContent = 'X';
      style_del.onclick = function() {
        let idx = addons_lst.indexOf(style);
        addons_lst.splice(idx, 1);
        style_div.remove();
        updateXP();
      };
      style_div.appendChild(style_del);

      addons_div.appendChild(style_div);
      addons_lst.push(style);
      break;
  }
}

function new_item_adds(addon_options, addons_lst = []) {
  let addons = { addons: [] };

  let res = document.createElement('div');

  let addons_div = document.createElement('div');
  res.appendChild(addons_div);

  for (const addon of addons_lst) {
    new_addon(addon.addon_kind, addons.addons, addons_div, addon);
  }

  let add = document.createElement('select');
  addOptions(add, addon_options, 0, 'Add...');
  add.onchange = function() {
    new_addon(add.value, addons.addons, addons_div);

    // And reset the add button
    add.value = 'Add...';
  };
  res.appendChild(add);

  addons.div = res;
  return addons;
}

function new_weapon(
  weapon = { name: '', style: { style: '' }, bonus: 0, feature: 0, addons: { addons: [] } }
) {
  var addons;
  if (isOffensive(weapon.style.style)) {
    addons = new_item_adds(offensive_addon_options, weapon.addons.addons);
  } else if (isDefensive(weapon.style.style)) {
    addons = new_item_adds(defensive_addon_options, weapon.addons.addons);
  } else {
    addons = new_item_adds([]);
  }
  weapon.kind = 'weapon';
  weapon.addons = addons;

  addons.div.children[1].disabled = (weapon.style.style == ''); // Disable add-ons until style is selected

  let weapon_div = document.createElement('div');
  weapon_div.className = 'item';

  let name = document.createElement('input');
  name.setAttribute('type', 'text');
  name.className = 'itemName';
  name.value = weapon.name;
  name.onchange = function() { weapon.name = name.value; };
  weapon_div.appendChild(name);

  let style = new_weapon_style(weapon.style);
  weapon.style = style;
  weapon_div.appendChild(style.div);

  let del = document.createElement('button');
  del.setAttribute('type', 'button');
  del.style.float = 'right';
  del.onclick = function() { deleteItem(weapon); };
  del.textContent = 'X';
  weapon_div.appendChild(del);

  // Add a line break
  weapon_div.appendChild(document.createElement('br'));

  let property_div = document.createElement('div');

  let bonus_text = document.createElement('b');
  bonus_text.textContent = 'Bonus ';
  property_div.appendChild(bonus_text);

  let bonus = document.createElement('input');
  bonus.setAttribute('type', 'number');
  bonus.className='bonus';
  bonus.value = weapon.bonus;
  bonus.onchange = function() {
    let val = parseInt(bonus.value);

    if (val == NaN) {
      val = weapon.bonus;
    } else if (val < 1) {
      val = 1;
    } else if (val > 2 && creation_mode) {
      val = 2;
    } else if (val > 3) {
      val = 3;
    }

    weapon.bonus = val;
    bonus.value = val;
    updateXP();
  };
  property_div.appendChild(bonus);

  let feature_text = document.createElement('b');
  if (isOffensive(weapon.style.style)) {
    feature_text.textContent = ' Dice ';
  } else if (isDefensive(weapon.style.style)) {
    feature_text.textContent = ' Block ';
  }
  property_div.appendChild(feature_text);

  let feature = document.createElement('input');
  feature.setAttribute('type', 'number');
  feature.className = 'bonus';
  feature.value = weapon.feature;
  feature.onchange = function() {
    let val = parseInt(feature.value);

    if (val == NaN) {
      val = weapon.feature;
    } else if (val < 1) {
      val = 1;
    } else if (val > 2 && isDefensive(weapon.style.style)) {
      // If it's defensive, the maximum block bonus is +2
      val = 2;
    } else if (val > 3) {
      // If it's offensive, the maximum number of dice is 3
      val = 3;
    }

    weapon.feature = val;
    feature.value = val;
    updateXP();
  };
  property_div.appendChild(feature);

  property_div.style.display = weapon.style.style == '' ? 'none' : 'inline';
  weapon_div.appendChild(property_div);

  style.div.onchange = function() {
    style.style = style.div.value;
    weapon.bonus = 1;
    weapon.feature = 1;

    bonus.value = 1;
    feature.value = 1;

    let addon_select = addons.div.children[1];
    addon_select.disabled = false;
    while (addon_select.firstChild) {
      addon_select.removeChild(addon_select.firstChild);
    }

    if (isDefensive(style.style)) {
      feature_text.textContent = ' Block ';
      addOptions(addon_select, defensive_addon_options, 0, 'Add...');

      var res_addons = [];
      for (addon of weapon.addons.addons) {
        if (addon.addon_kind == 'block') {
          addon.div.remove();
        } else {
          res_addons.push(addon);
        }
      }
      weapon.addons.addons = res_addons;
      updateXP();
    } else {
      feature_text.textContent = ' Dice ';
      addOptions(addon_select, offensive_addon_options, 0, 'Add...');
    }

    property_div.style.display = 'inline';
  };

  weapon_div.appendChild(addons.div);

  weapon.div = weapon_div;
  return weapon;
}

function new_relic(
  relic = { name: '', bonus: 1, experience: '', addons: { addons: [] } }
) {
  let addons = new_item_adds(relic_addon_options, relic.addons.addons);
  relic.kind = 'relic';
  relic.addons = addons;

  let relic_div = document.createElement('div');
  relic_div.className = 'item';

  let name = document.createElement('input');
  name.setAttribute('type', 'text');
  name.className = 'itemName';
  name.value = relic.name;
  name.onchange = function() { relic.name = name.value; };
  relic_div.appendChild(name);

  let bonus = document.createElement('input');
  bonus.setAttribute('type', 'number');
  bonus.className='bonus';
  bonus.value = relic.bonus;
  bonus.onchange = function() {
    let val = parseInt(bonus.value);

    if (val == NaN) {
      val = relic.bonus;
    } else if (val < 1) {
      val = 1;
    } else if (val > 2 && creation_mode) {
      val = 2;
    } else if (val > 3) {
      val = 3;
    }

    relic.bonus = val;
    bonus.value = val;
    updateXP();
  };
  relic_div.appendChild(bonus);

  let experience = document.createElement('input');
  experience.setAttribute('type', 'text');
  experience.value = relic.experience;
  experience.onchange = function() { relic.experience = experience.value; };
  relic_div.appendChild(experience);

  let del = document.createElement('button');
  del.setAttribute('type', 'button');
  del.style.float = 'right';
  del.onclick = function() { deleteItem(relic); };
  del.textContent = 'X';
  relic_div.appendChild(del);

  relic_div.appendChild(addons.div);

  relic.div = relic_div;
  return relic;
}

function addWeapon() {
  let item = new_weapon();
  items.push(item);
  document.getElementById('items').appendChild(item.div);
  updateXP();
}

function addRelic() {
  let item = new_relic();
  items.push(item);
  document.getElementById('items').appendChild(item.div);
  updateXP();
}

function deleteItem(item) {
  let idx = items.indexOf(item);
  items.splice(idx, 1); // delete the item
  item.div.remove();
  updateXP();
}

function itemsXP() {
  var xp = 0;

  // Everything after the first item costs 1 XP to get
  if (items.length > 1) { xp += items.length - 1; }

  for (const item of items) {
    var totalBonus = 0; // Total bonus the weapon grants

    for (const addon of item.addons.addons) {
      switch (addon.addon_kind) {
        case 'ability':
          xp += abilityXP(addon.kind, addon.level);
          break;
        case 'attribute':
          let n = addon.bonus;
          totalBonus += n;
          xp += 2 * n * (n + 1) / 2; // Extra cost
          break;
        case 'block':
          let m = addon.bonus;
          totalBonus += m;
          xp += 2 * m * (m + 1) / 2; // Extra cost
          break;
        case 'experience':
          totalBonus += addon.bonus;
          break;
        case 'life':
          xp += 2 * addon.bonus;
          break;
        case 'recovery':
          xp += 4 * addon.bonus;
          break;
        case 'specialization':
          totalBonus += addon.bonus;
          xp += specTagXP(addon.tag);
          break;
        case 'style': xp += 3;
          break;
      }
    }

    switch (item.kind) {
      case 'weapon':
        totalBonus += item.bonus;

        if (isDefensive(item.style.style)) {
          // Defensive, so feature is block
          let n = item.feature;
          totalBonus += n;
          xp += 2 * n * (n + 1) / 2 - 2; // -2 since first block is free
          xp -= 2; // -2 since we start with one to defend and one to block
        } else if (isOffensive(item.style.style)) {
          // Offensive, so feature is damage dice
          let n = item.feature;
          xp += 5 * n * (n + 1) / 2 - 5; // -5 since first die is free
        }
        break;
      case 'relic':
        totalBonus += item.bonus;
        break;
    }

    if (totalBonus >= 1) {
      xp += totalBonus * (totalBonus + 1) / 2 - 1; // -1 since initial bonus is free
    }
  }

  return xp;
}

function validateItems() {
  for (item of items) {
    if (item.bonus > 2 && creation_mode) {
      item.bonus = 2;
      if (item.kind == 'weapon') {
        item.div.children[4].children[1].value = 2;
      } else {
        item.div.children[1].value = 2;
      }
    }

    for (addon of item.addons.addons) {
      switch (addon.addon_kind) {
        case 'attribute': case 'block':
          if (addon.bonus > 2 && creation_mode) {
            addon.bonus = 2;
            addon.div.children[1].value = 2;
          }
          break;
        case 'experience':
          if (addon.bonus > 2 && creation_mode) {
            addon.bonus = 2;
            addon.div.children[0].value = 2;
          }
          break;
        case 'specialization':
          if (addon.bonus > 2 && creation_mode) {
            addon.bonus = 2;
            addon.div.children[3].value = 2;
          }
          break;
      }
    }
  }
}

// Called when a combat style's kind is changed so we can update the combat
// styles available to weapons
function combatStylesChanged() {
  for (item of items) {
    if (item.kind == 'weapon') {
      let selector = item.style.div;
      let selected = selector.value;

      let new_options = offensives.map((s) => (s.kind)).concat(defensives.map((s) => (s.kind)));

      while (selector.firstChild) { selector.removeChild(selector.firstChild); }
      addOptions(selector, new_options, 0);

      if (new_options.includes(selected)) {
        selector.value = selected;
      } else {
        item.style.style = '';
        selector.value = '';
        item.div.children[4].style.display = 'none';
        item.bonus = 0;
        item.feature = 0;
      }
    }
  }
}
