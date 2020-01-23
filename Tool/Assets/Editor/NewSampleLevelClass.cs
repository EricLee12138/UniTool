using UnityEngine;
using UnityEditor;

public static class NewSampleLevelClass {
	[MenuItem("Level/NewSampleLevel", false, 2)]
	private static void NewSampleLevel() {
		// Write your execution function code here
		UnityEditor.SceneManagement.EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo();
		UnityEditor.SceneManagement.EditorSceneManager.NewScene(UnityEditor.SceneManagement.NewSceneSetup.EmptyScene);
	}
}