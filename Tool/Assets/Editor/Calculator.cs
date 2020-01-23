using UnityEngine;
using UnityEditor;
using UnityEditor.AnimatedValues;

[CustomEditor(typeof(Calculator))]
public class CalculatorInspector: Editor {
	Calculator _target;


	void OnEnable() {
		_target = (Calculator) target;
	}


	public override void OnInspectorGUI() {
		EditorGUILayout.BeginHorizontal();
		_target.numA = EditorGUILayout.IntField("Number A", _target.numA);
		_target.numB = EditorGUILayout.IntField("Number B", _target.numB);
		EditorGUILayout.EndHorizontal();

		_target.cal = (Calculation) EditorGUILayout.EnumPopup("Calculation", _target.cal);
		if (GUILayout.Button("Calculate")) {
			// Write your execution function code here
			int result = 0;

			switch (_target.cal) {
				case Calculation.Add:
					result = _target.numA + _target.numB;
					break;
				case Calculation.Subtract:
					result = _target.numA - _target.numB;
					break;
				case Calculation.Multiply:
					result = _target.numA * _target.numB;
					break;
			}

			Debug.Log("The result is: " + result.ToString());
		}
	}
}