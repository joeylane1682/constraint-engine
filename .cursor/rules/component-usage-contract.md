# Component Usage Contract

## Selection Principle
When multiple components satisfy usage:
1. Prefer clarity (text > icon)
2. Prefer lower visual weight if clarity is preserved
3. Prefer consistency with surrounding patterns

---

## Inputs

### Button
Purpose:
Trigger visible, high-importance actions.

Usage:
- Primary and secondary actions
- Form submission
- Section-level CTAs

States:
- default, hover, active, disabled

Restrictions:
- Avoid when space is constrained → use IconButton
- Avoid for floating/global actions → use FAB
- Avoid for navigation → use Link

---

### IconButton
Purpose:
Trigger compact actions using icons.

Usage:
- Toolbars, cards, dense layouts

States:
- default, hover, active, disabled

Restrictions:
- Avoid for primary actions → use Button
- Avoid if icon meaning is unclear

---

### TextField
Purpose:
Capture user input.

Usage:
- Forms, search, inline editing

States:
- empty, focused, filled, error, disabled

Restrictions:
- Must include label or placeholder
- Use validation when required

---

### Select
Purpose:
Select from predefined options.

Usage:
- Forms with limited choices

States:
- closed, open, selected, disabled

Restrictions:
- Avoid for large datasets → use Autocomplete

---

### Checkbox
Purpose:
Allow multi-selection.

Usage:
- Lists, filters, settings

States:
- checked, unchecked, indeterminate, disabled

Restrictions:
- Avoid for single selection → use Radio

---

### Radio
Purpose:
Allow single selection.

Usage:
- Mutually exclusive options

States:
- selected, unselected, disabled

Restrictions:
- Avoid for multi-select → use Checkbox

---

### Switch
Purpose:
Toggle a binary state.

Usage:
- Settings, on/off controls

States:
- on, off, disabled

Restrictions:
- Avoid when confirmation is required

---

## Layout

### Stack
Purpose:
One-dimensional layout.

Usage:
- Vertical or horizontal spacing

States:
- row, column

Restrictions:
- Avoid for grid layouts → use Grid

---

### Grid
Purpose:
Responsive two-dimensional layout.

Usage:
- Page and section structure

States:
- breakpoints (xs–xl)

Restrictions:
- Avoid for simple layouts → use Stack

---

### Container
Purpose:
Center and constrain content width.

Usage:
- Page-level layout

States:
- fixed, fluid

Restrictions:
- Avoid nesting multiple containers

---

### Box
Purpose:
Generic layout wrapper.

Usage:
- Custom layout/styling

States:
- none

Restrictions:
- Avoid when semantic component exists

---

## Data Display

### Card
Purpose:
Group related content.

Usage:
- Dashboards, lists, previews

States:
- default, hover

Restrictions:
- Avoid deep nesting

---

### Table
Purpose:
Display structured tabular data.

Usage:
- Large datasets, comparisons

States:
- loading, sorted, selected

Restrictions:
- Avoid for simple lists → use List

---

### List
Purpose:
Display vertical collections.

Usage:
- Navigation, simple datasets

States:
- selected, hover

Restrictions:
- Avoid complex data → use Table

---

### Chip
Purpose:
Represent small pieces of information.

Usage:
- Tags, filters, selections

States:
- default, selected, deletable

Restrictions:
- Avoid for primary actions → use Button

---

## Navigation

### AppBar
Purpose:
Top-level navigation container.

Usage:
- Headers, global actions

States:
- fixed, static

Restrictions:
- Avoid excessive content

---

### Drawer
Purpose:
Side navigation panel.

Usage:
- App navigation, filters

States:
- open, closed

Restrictions:
- Avoid for primary navigation on desktop if space allows

---

### Tabs
Purpose:
Switch between views.

Usage:
- Content grouping

States:
- active, inactive

Restrictions:
- Avoid for navigation between unrelated content

---

## Feedback

### Dialog
Purpose:
Interrupt flow for critical actions.

Usage:
- Confirmations, forms

States:
- open, closed

Restrictions:
- Avoid overuse

---

### Snackbar
Purpose:
Show brief notifications.

Usage:
- Success/error feedback

States:
- visible, hidden

Restrictions:
- Avoid critical actions → use Dialog

---

### Alert
Purpose:
Display important messages inline.

Usage:
- Errors, warnings, info

States:
- severity levels

Restrictions:
- Avoid transient messages → use Snackbar
