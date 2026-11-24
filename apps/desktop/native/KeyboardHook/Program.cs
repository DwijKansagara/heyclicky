using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace HeyClicky.Native
{
    class Program
    {
        private const int WH_KEYBOARD_LL = 13;
        private const int WM_KEYDOWN = 0x0100;
        private const int WM_KEYUP = 0x0101;
        private const int WM_SYSKEYDOWN = 0x0104;
        private const int WM_SYSKEYUP = 0x0105;

        private const int VK_ESCAPE = 0x1B;
        private const int VK_SPACE = 0x20;
        private const int VK_CONTROL = 0x11;
        private const int VK_MENU = 0x12; // Alt key

        private static LowLevelKeyboardProc _proc = HookCallback;
        private static IntPtr _hookId = IntPtr.Zero;

        private static bool _ctrlDown = false;
        private static bool _altDown = false;
        private static bool _wasBothDown = false;

        static void Main(string[] args)
        {
            if (args.Length > 0 && args[0] == "--test")
            {
                Console.WriteLine("[HOOK_READY] HeyClicky Windows Low-Level Keyboard Hook Initialized (handle=TEST_HOOK)");
                Console.Out.Flush();
                System.Threading.Thread.Sleep(100);
                Console.WriteLine("CTRL_ALT_DOWN");
                Console.Out.Flush();
                System.Threading.Thread.Sleep(200);
                Console.WriteLine("CTRL_ALT_UP");
                Console.Out.Flush();
                System.Threading.Thread.Sleep(100);
                Console.WriteLine("ESCAPE_KILL_SWITCH");
                Console.Out.Flush();
                return;
            }

            _hookId = SetHook(_proc);
            if (_hookId == IntPtr.Zero)
            {
                int err = Marshal.GetLastWin32Error();
                Console.WriteLine($"[HOOK_ERROR] Failed to set hook, error: {err}");
                Console.Out.Flush();
                return;
            }

            Console.WriteLine($"[HOOK_READY] HeyClicky Windows Low-Level Keyboard Hook Initialized (handle={_hookId})");
            Console.Out.Flush();

            // Handle graceful termination
            AppDomain.CurrentDomain.ProcessExit += (s, e) => UnhookWindowsHookEx(_hookId);
            Console.CancelKeyPress += (s, e) => {
                UnhookWindowsHookEx(_hookId);
                Environment.Exit(0);
            };

            // Standard Windows message pump
            MSG msg;
            while (GetMessage(out msg, IntPtr.Zero, 0, 0) > 0)
            {
                TranslateMessage(ref msg);
                DispatchMessage(ref msg);
            }

            UnhookWindowsHookEx(_hookId);
        }

        private static IntPtr SetHook(LowLevelKeyboardProc proc)
        {
            using (Process curProcess = Process.GetCurrentProcess())
            using (ProcessModule curModule = curProcess.MainModule!)
            {
                IntPtr hMod = GetModuleHandle(curModule.ModuleName);
                return SetWindowsHookEx(WH_KEYBOARD_LL, proc, hMod, 0);
            }
        }

        private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

        private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (nCode >= 0)
            {
                int msg = wParam.ToInt32();
                int vkCode = Marshal.ReadInt32(lParam);

                bool isKeyDown = (msg == WM_KEYDOWN || msg == WM_SYSKEYDOWN);
                bool isKeyUp = (msg == WM_KEYUP || msg == WM_SYSKEYUP);

                if (vkCode == 0xA2 || vkCode == 0xA3 || vkCode == VK_CONTROL) // Left/Right Ctrl
                {
                    _ctrlDown = isKeyDown;
                }
                else if (vkCode == 0xA4 || vkCode == 0xA5 || vkCode == VK_MENU) // Left/Right Alt
                {
                    _altDown = isKeyDown;
                }

                bool isBothDown = _ctrlDown && _altDown;

                if (isBothDown && !_wasBothDown)
                {
                    _wasBothDown = true;
                    Console.WriteLine("CTRL_ALT_DOWN");
                    Console.Out.Flush();
                }
                else if (!isBothDown && _wasBothDown)
                {
                    _wasBothDown = false;
                    Console.WriteLine("CTRL_ALT_UP");
                    Console.Out.Flush();
                }

                // Check Escape for instant kill-switch
                if (vkCode == VK_ESCAPE && isKeyDown)
                {
                    Console.WriteLine("ESCAPE_KILL_SWITCH");
                    Console.Out.Flush();
                }

                // Check Ctrl+Alt+Space double/alternate trigger
                if (vkCode == VK_SPACE && isKeyDown && isBothDown)
                {
                    Console.WriteLine("CTRL_ALT_SPACE");
                    Console.Out.Flush();
                }
            }

            return CallNextHookEx(_hookId, nCode, wParam, lParam);
        }

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool UnhookWindowsHookEx(IntPtr hhk);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr GetModuleHandle(string lpModuleName);

        [DllImport("user32.dll")]
        private static extern short GetAsyncKeyState(int vKey);

        [DllImport("user32.dll")]
        private static extern int GetMessage(out MSG lpMsg, IntPtr hWnd, uint wMsgFilterMin, uint wMsgFilterMax);

        [DllImport("user32.dll")]
        private static extern bool TranslateMessage([In] ref MSG lpMsg);

        [DllImport("user32.dll")]
        private static extern IntPtr DispatchMessage([In] ref MSG lpMsg);

        [StructLayout(LayoutKind.Sequential)]
        private struct MSG
        {
            public IntPtr hwnd;
            public uint message;
            public IntPtr wParam;
            public IntPtr lParam;
            public uint time;
            public POINT pt;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct POINT
        {
            public int x;
            public int y;
        }
    }
}
