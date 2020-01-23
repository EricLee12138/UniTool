using UnityEngine;
using UnityEditor;
using UnityEditor.AnimatedValues;

public class MapEditor: EditorWindow {
	Calculation calculation;
	Vector2 vec2;
	Calculation cal;
	Vector2 _scrollViewPosition;
	int cols;


	[MenuItem("Window/Yuponic/YuME: Map Editor")]
	static void Open() {
		EditorWindow window = GetWindow(typeof(MapEditor), false, "Map Editor");
		window.Show();
	}


	void OnEnable() {}


	private void OnGUI() {
		EditorGUILayout.BeginHorizontal("Box");
		if (GUILayout.Button("Enable YuME")) {
			// Write your execution function code here

		}
		if (GUILayout.Button("Settings")) {
			// Write your execution function code here

		}
		EditorGUILayout.EndHorizontal();

		EditorGUILayout.BeginHorizontal("Box");
		calculation = (Calculation) EditorGUILayout.EnumPopup("", calculation);
		if (GUILayout.Button("Add")) {
			// Write your execution function code here

		}
		EditorGUILayout.EndHorizontal();

		vec2 = EditorGUILayout.Vector2Field("Grid Dimensions", vec2);
		EditorGUILayout.BeginHorizontal("Box");
		if (GUILayout.Button("Flat Grid")) {
			// Write your execution function code here

		}
		if (GUILayout.Button("Button")) {
			// Write your execution function code here

		}
		EditorGUILayout.EndHorizontal();

		EditorGUILayout.BeginHorizontal("Box");
		EditorGUILayout.HelpBox("Grid Height:", MessageType.None, true);
		EditorGUILayout.HelpBox("Brush Size:", MessageType.None, true);
		EditorGUILayout.EndHorizontal();

		EditorGUILayout.BeginVertical("Box");
		cal = (Calculation) EditorGUILayout.EnumPopup("Choose Tileset", cal);
		if (GUILayout.Button("Reload Available Tilesets")) {
			// Write your execution function code here

		}
		EditorGUILayout.EndVertical();

		EditorGUILayout.BeginHorizontal("Box");
		if (GUILayout.Button("Tileset Brushes")) {
			// Write your execution function code here

		}
		if (GUILayout.Button("Custom Brushes")) {
			// Write your execution function code here

		}
		EditorGUILayout.EndHorizontal();

		_scrollViewPosition = EditorGUILayout.BeginScrollView(_scrollViewPosition, false, true);
		EditorGUILayout.EndScrollView();

		EditorGUILayout.BeginVertical("Box");
		cols = EditorGUILayout.IntSlider("Columns", cols, 1, 10);
		EditorGUILayout.EndVertical();

		if (GUILayout.Button("Use ALT Tiles")) {
			// Write your execution function code here

		}
		if (GUILayout.Button("Freese Map")) {
			// Write your execution function code here

		}
	}
}