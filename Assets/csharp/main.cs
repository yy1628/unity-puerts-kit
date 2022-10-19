using UnityEngine;

namespace tiny
{
	public class main : JavaScriptLauncher
	{
		// 等待数帧，让 splash 展示出来，否则在JS端界面创建好之前是卡住黑屏状态
		private int frameToWait = 20; // Unity 的闪屏背景过渡要这么久，不然会卡闪屏和 splash 对象在过渡状态
		public UnityEngine.Transform splash;
		static main() { }

		void Aweak()
		{
			if (UnityEngine.Application.isEditor) frameToWait = 0;
		}

		public static void Restart()
		{
			Destroy(inst.gameObject);
			var obj = new UnityEngine.GameObject("main");
			obj.AddComponent<main>();
		}

		protected override async System.Threading.Tasks.Task StartJavaScript()
		{
			await base.StartJavaScript();
			if (this.splash != null)
			{
				Destroy(this.splash.gameObject);
				this.splash = null;
			}
		}

		protected override void RegisterClasses(Puerts.JsEnv vm)
		{
			base.RegisterClasses(vm);
			// TODO: 在此注册C#回调函数
		}

		protected new void Update()
		{
			if (this.frameToWait == 0)
			{
				frameToWait -= 1;
#pragma warning disable 4014
				this.StartJavaScript();
			}
			base.Update();
			this.frameToWait -= 1;
		}
	}

#if UNITY_EDITOR
	[UnityEditor.CustomEditor(typeof(main))]
	class JavaScriptLauncherEditor : UnityEditor.Editor
	{
		public override void OnInspectorGUI()
		{
			base.DrawDefaultInspector();
			if (UnityEngine.GUILayout.Button("重置调试目录"))
			{
				(target as JavaScriptLauncher).DebuggerRoot = System.IO.Path.Combine(UnityEngine.Application.streamingAssetsPath, "scripts").Replace("\\", "/");
				UnityEditor.SceneManagement.EditorSceneManager.SaveOpenScenes();
				UnityEditor.EditorUtility.SetDirty(target);
			}
			if (UnityEngine.GUILayout.Button("重启"))
			{
				if (UnityEngine.Application.isPlaying)
				{
					main.Restart();
				}
			}
		}
	}
#endif
}
