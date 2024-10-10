class CategoryItem {
  constructor(label, icon) {
    this.label = `${label}`;
    this.value = label;
  }
}

const CategoryItems = [
  new CategoryItem("Health", "👩‍⚕️"),
  new CategoryItem("Fitness", "💪"),
  new CategoryItem("Wellness", "💆"),
  new CategoryItem("Productivity", "💻"),
  new CategoryItem("Money", "💵"),
  new CategoryItem("Education", "👩‍🎓"),
  new CategoryItem("Hobbies", "🚴‍♂️"),
  new CategoryItem("Chores", "🧹"),
  new CategoryItem("Relationships", "🧑‍🤝‍🧑"),
  new CategoryItem("Business", "🧑🏼‍💼"),
];

export default CategoryItems;
