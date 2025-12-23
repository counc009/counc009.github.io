function dump() {
  let name = document.getElementById('name').value;

  let data = {
    in_create_mode: creation_mode,
    name: name,
    stats: statistics,
    attrs: attributes,
    speed: speeds,
    specs: specializations,
    exprs: experiences,
    abils: abilities,
    offns: offensives,
    defns: defensives,
    items: items,
  };

  let json = JSON.stringify(data, (key, value) => (key == 'div' ? undefined : value));

  const link = document.createElement('a');
  const file = new Blob([json], { type: 'application/json' });
  link.href = URL.createObjectURL(file);
  link.download = name + '.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

const pickerOpts = {
  types: [
    {
      description: "Characters",
      accept: {
        'json/*': ['.json'],
      },
    }
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};

async function load() {
  let input = document.getElementById('load');
  let files = input.files;
  let file = files[0];
  let text = await file.text();

  let data = JSON.parse(text);

  creation_mode = data.in_create_mode;
  document.getElementById('mode').checked = data.in_create_mode;

  document.getElementById('name').value = data.name;

  statistics = data.stats;
  document.getElementById('strength').value = data.stats.strength;
  document.getElementById('finesse').value = data.stats.finesse;
  document.getElementById('willpower').value = data.stats.willpower;
  document.getElementById('instinct').value = data.stats.instinct;
  document.getElementById('presence').value = data.stats.presence;
  document.getElementById('knowledge').value = data.stats.knowledge;

  attributes = data.attrs;
  document.getElementById('life').value = data.attrs.life;
  document.getElementById('recovery').value = data.attrs.recovery;
  document.getElementById('block').value = data.attrs.block;
  document.getElementById('wealth').value = data.attrs.wealth;

  speeds = data.speed;
  document.getElementById('walk').value = data.speed.walk;
  document.getElementById('climb').value = data.speed.climb;
  document.getElementById('swim').value = data.speed.swim;
  document.getElementById('burrow').value = data.speed.burrow;
  document.getElementById('fly').value = data.speed.fly;

  specializations = [];
  clearChildren(document.getElementById('specializations'));
  for (const spec of data.specs) {
    let spec_obj = new_spec((spec) => (() => { deleteSpecialization(spec); }), spec);
    specializations.push(spec_obj);
    document.getElementById('specializations').append(spec_obj.div);
  }

  experiences = [];
  clearChildren(document.getElementById('experiences'));
  for (const expr of data.exprs) {
    let expr_obj = new_experience((exp) => (() => { deleteExperience(exp); }), expr);
    experiences.push(expr_obj);
    document.getElementById('experiences').append(expr_obj.div);
  }

  abilities = [];
  clearChildren(document.getElementById('abilities'));
  for (const abil of data.abils) {
    let abil_obj = new_ability((ability) => (() => { deleteAbility(ability); }), abil);
    abilities.push(abil_obj);
    document.getElementById('abilities').append(abil_obj.div);
  }

  offensives = [];
  clearChildren(document.getElementById('offensives'));
  for (const style of data.offns) {
    let style_obj = new_offensive(style);
    offensives.push(style_obj);
    document.getElementById('offensives').append(style_obj.div);
  }

  defensives = [];
  clearChildren(document.getElementById('defensives'));
  for (const style of data.defns) {
    let style_obj = new_defensive(style);
    defensives.push(style_obj);
    document.getElementById('defensives').append(style_obj.div);
  }

  items = [];
  clearChildren(document.getElementById('items'));
  for (const item of data.items) {
    var item_obj;
    switch (item.kind) {
      case 'weapon': item_obj = new_weapon(item); break;
      case 'relic':  item_obj = new_relic(item); break;
    }
    items.push(item_obj);
    document.getElementById('items').append(item_obj.div);
  }

  input.value = '';
  updateXP();
}
