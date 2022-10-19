using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class BlockInputEvents : MonoBehaviour
{
	// Start is called before the first frame update
	void Start()
	{

	}

	//OnMouseDown is called when the user has pressed the mouse button while over the Collider.
	private void OnMouseDown()
	{
		// 禁用多点触控
		if (Input.touchCount == 1 && EventSystem.current.IsPointerOverGameObject(Input.GetTouch(0).fingerId))
		{
			return;
		}
	}
    
	//OnMouseDrag is called when the user has clicked on a Collider and is still holding down the mouse.
	private void OnMouseDrag()
	{
		// 禁用多点触控
		if (Input.touchCount == 1 && EventSystem.current.IsPointerOverGameObject(Input.GetTouch(0).fingerId))
		{
			return;
		}
	}

	//Called when the mouse enters the Collider.
	private void OnMouseEnter()
	{
		// 禁用多点触控
		if (Input.touchCount == 1 && EventSystem.current.IsPointerOverGameObject(Input.GetTouch(0).fingerId))
		{
			return;
		}
	}

	//Called when the mouse is not any longer over the Collider.
	private void OnMouseExit()
	{
		// 禁用多点触控
		if (Input.touchCount == 1 && EventSystem.current.IsPointerOverGameObject(Input.GetTouch(0).fingerId))
		{
			return;
		}
	}

	//Called every frame while the mouse is over the Collider.
	private void OnMouseOver()
	{
		// 禁用多点触控
		if (Input.touchCount == 1 && EventSystem.current.IsPointerOverGameObject(Input.GetTouch(0).fingerId))
		{
			return;
		}
	}

	// OnMouseUp is called when the user has released the mouse button.
	private void OnMouseUp()
	{
		// 禁用多点触控
		if (Input.touchCount == 1 && EventSystem.current.IsPointerOverGameObject(Input.GetTouch(0).fingerId))
		{
			return;
		}
	}

	// OnMouseUpAsButton is only called when the mouse is released over the same Collider as it was pressed.
	private void OnMouseUpAsButton()
	{
		// 禁用多点触控
		if (Input.touchCount == 1 && EventSystem.current.IsPointerOverGameObject(Input.GetTouch(0).fingerId))
		{
			return;
		}

	}

	// Update is called once per frame
	void Update()
	{

	}
}
