using UnityEngine;
using UnityEditor;

public static class NewLevelClass {
	[MenuItem("Level/NewLevel", false, 1)]
	private static void NewLevel() {
		// Write your execution function code here
		UnityEditor.SceneManagement.EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo();
		UnityEditor.SceneManagement.EditorSceneManager.NewScene(UnityEditor.SceneManagement.NewSceneSetup.EmptyScene);
	}
}