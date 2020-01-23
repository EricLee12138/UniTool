using UnityEngine;
using UnityEditor;

public static class DeleteSelectedObjectClass {
	[MenuItem("Object/DeleteSelectedObject", false, 0)]
	private static void DeleteSelectedObject() {
			// Write your execution function code here
			Object.DestroyImmediate(Selection.activeGameObject);
		}
		[MenuItem("Object/DeleteSelectedObject", true, 0)]
	private static bool ValidateDeleteSelectedObject() {
		// Write your validation function code here
		return Selection.activeGameObject != null;
	}
}