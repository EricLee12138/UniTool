using UnityEngine;
using UnityEditor;
using UnityEditor.AnimatedValues;

[CustomEditor(typeof(ObjectSelector))]
public class ObjectSelectorInspector: Editor {
	ObjectSelector _target;
	bool _toggleGroupEnable;


	void OnEnable() {
		_target = (ObjectSelector) target;
	}


	public override void OnInspectorGUI() {
		_toggleGroupEnable = EditorGUILayout.BeginToggleGroup("ToggleGroup", _toggleGroupEnable);
		_target.textr = (Texture) EditorGUILayout.ObjectField("Texture Object", _target.textr, typeof(Texture), true);
		_target.transf = (Transform) EditorGUILayout.ObjectField("Transform Object", _target.transf, typeof(Transform), true);
		EditorGUILayout.EndToggleGroup();

	}
}