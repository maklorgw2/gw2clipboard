using System;
using System.IO.MemoryMappedFiles;
using System.Runtime.InteropServices;

namespace GW2Clipboard
{
    public class MumbleLinkFile : IDisposable
    {
        public const string MapName = "MumbleLink";

        /// <summary>Holds a reference to the shared memory block.</summary>
        private readonly MemoryMappedFile memoryMappedFile;

        /// <summary>Indicates whether this object is disposed.</summary>
        private bool disposed;

        public MumbleLinkFile(MemoryMappedFile memoryMappedFile)
        {
            this.memoryMappedFile = memoryMappedFile ?? throw new ArgumentNullException("memoryMappedFile");
        }

        /// <summary>
        ///     Creates or opens a memory-mapped file for the MumbleLink protocol.
        /// </summary>
        /// <returns>An object that provides wrapper methods for the MumbleLink protocol.</returns>
        public static MumbleLinkFile CreateOrOpen()
        {
            return new MumbleLinkFile(MemoryMappedFile.CreateOrOpen(MapName, Marshal.SizeOf<MumbleData>()));
        }

        /// <inheritdoc />
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public byte[] ReadRaw()
        {
            if (disposed)
            {
                throw new ObjectDisposedException(GetType().FullName);
            }
            using (var stream = memoryMappedFile.CreateViewStream())
            {
                // Copy the shared memory block to a local buffer in managed memory
                var buffer = new byte[stream.Length];
                stream.Read(buffer, 0, buffer.Length);
                return buffer;
            }
        }

        /// <summary>Retrieves positional audio data from the shared memory block as defined by the Mumble Link protocol.</summary>
        /// <returns>Positional audio data.</returns>
        public MumbleData Read()
        {
            if (disposed)
            {
                throw new ObjectDisposedException(GetType().FullName);
            }
            using (var stream = memoryMappedFile.CreateViewStream())
            {
                // Copy the shared memory block to a local buffer in managed memory
                var buffer = new byte[stream.Length];
                stream.Read(buffer, 0, buffer.Length);

                // Pin the managed memory so that the GC doesn't move it
                var handle = GCHandle.Alloc(buffer, GCHandleType.Pinned);

                // Get the address of the managed memory
                var ptr = handle.AddrOfPinnedObject();
                MumbleData avatar;
                try
                {
                    // Copy the managed memory to a managed struct
                    avatar = (MumbleData)Marshal.PtrToStructure(ptr, typeof(MumbleData));
                }
                finally
                {
                    // Release the handle
                    handle.Free();
                }

                return avatar;
            }
        }

        /// <summary>Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.</summary>
        /// <param name="disposing"><c>true</c> if managed resources should be released.</param>
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
            {
                return;
            }
            if (disposing)
            {
                memoryMappedFile.Dispose();
            }
            disposed = true;
        }
    }
}