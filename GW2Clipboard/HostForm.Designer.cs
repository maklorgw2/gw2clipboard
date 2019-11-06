namespace GW2Clipboard
{
    partial class HostForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(HostForm));
            this.browser = new System.Windows.Forms.WebBrowser();
            this.notifyIcon = new System.Windows.Forms.NotifyIcon(this.components);
            this.timer = new System.Windows.Forms.Timer(this.components);
            this.TitleLabel = new System.Windows.Forms.Label();
            this.RightBorderPanel = new System.Windows.Forms.Panel();
            this.LeftBorderPanel = new System.Windows.Forms.Panel();
            this.BottomBorderPanel = new System.Windows.Forms.Panel();
            this.TopBorderPanel = new System.Windows.Forms.Panel();
            this.TopRightCornerPanel = new System.Windows.Forms.Panel();
            this.BottomLeftCornerPanel = new System.Windows.Forms.Panel();
            this.BottomRightCornerPanel = new System.Windows.Forms.Panel();
            this.TopLeftCornerPanel = new System.Windows.Forms.Panel();
            this.DecorationToolTip = new System.Windows.Forms.ToolTip(this.components);
            this.MinimizeLabel = new System.Windows.Forms.Label();
            this.CloseLabel = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // browser
            // 
            this.browser.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.browser.Location = new System.Drawing.Point(2, 25);
            this.browser.MinimumSize = new System.Drawing.Size(20, 20);
            this.browser.Name = "browser";
            this.browser.ScrollBarsEnabled = false;
            this.browser.Size = new System.Drawing.Size(540, 392);
            this.browser.TabIndex = 23;
            this.browser.Url = new System.Uri("", System.UriKind.Relative);
            // 
            // notifyIcon
            // 
            this.notifyIcon.Text = "GW2Clipboard";
            this.notifyIcon.MouseClick += new System.Windows.Forms.MouseEventHandler(this.notifyIcon_MouseClick);
            // 
            // timer
            // 
            this.timer.Tick += new System.EventHandler(this.timer_Tick);
            // 
            // TitleLabel
            // 
            this.TitleLabel.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.TitleLabel.BackColor = System.Drawing.Color.Black;
            this.TitleLabel.Font = new System.Drawing.Font("Segoe UI", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.TitleLabel.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(224)))), ((int)(((byte)(192)))));
            this.TitleLabel.Location = new System.Drawing.Point(1, 0);
            this.TitleLabel.Name = "TitleLabel";
            this.TitleLabel.Size = new System.Drawing.Size(542, 24);
            this.TitleLabel.TabIndex = 22;
            this.TitleLabel.Text = "Title";
            this.TitleLabel.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // RightBorderPanel
            // 
            this.RightBorderPanel.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.RightBorderPanel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(43)))), ((int)(((byte)(87)))), ((int)(((byte)(154)))));
            this.RightBorderPanel.Cursor = System.Windows.Forms.Cursors.SizeWE;
            this.RightBorderPanel.Location = new System.Drawing.Point(542, 0);
            this.RightBorderPanel.Name = "RightBorderPanel";
            this.RightBorderPanel.Size = new System.Drawing.Size(2, 417);
            this.RightBorderPanel.TabIndex = 19;
            // 
            // LeftBorderPanel
            // 
            this.LeftBorderPanel.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.LeftBorderPanel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(43)))), ((int)(((byte)(87)))), ((int)(((byte)(154)))));
            this.LeftBorderPanel.Cursor = System.Windows.Forms.Cursors.SizeWE;
            this.LeftBorderPanel.Location = new System.Drawing.Point(0, 0);
            this.LeftBorderPanel.Name = "LeftBorderPanel";
            this.LeftBorderPanel.Size = new System.Drawing.Size(2, 417);
            this.LeftBorderPanel.TabIndex = 18;
            // 
            // BottomBorderPanel
            // 
            this.BottomBorderPanel.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.BottomBorderPanel.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.BottomBorderPanel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(43)))), ((int)(((byte)(87)))), ((int)(((byte)(154)))));
            this.BottomBorderPanel.Cursor = System.Windows.Forms.Cursors.SizeNS;
            this.BottomBorderPanel.Location = new System.Drawing.Point(1, 417);
            this.BottomBorderPanel.Name = "BottomBorderPanel";
            this.BottomBorderPanel.Size = new System.Drawing.Size(542, 2);
            this.BottomBorderPanel.TabIndex = 17;
            // 
            // TopBorderPanel
            // 
            this.TopBorderPanel.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.TopBorderPanel.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.TopBorderPanel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(43)))), ((int)(((byte)(87)))), ((int)(((byte)(154)))));
            this.TopBorderPanel.Cursor = System.Windows.Forms.Cursors.SizeNS;
            this.TopBorderPanel.Location = new System.Drawing.Point(1, 0);
            this.TopBorderPanel.Name = "TopBorderPanel";
            this.TopBorderPanel.Size = new System.Drawing.Size(542, 2);
            this.TopBorderPanel.TabIndex = 16;
            // 
            // TopRightCornerPanel
            // 
            this.TopRightCornerPanel.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.TopRightCornerPanel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(43)))), ((int)(((byte)(87)))), ((int)(((byte)(154)))));
            this.TopRightCornerPanel.Cursor = System.Windows.Forms.Cursors.SizeNESW;
            this.TopRightCornerPanel.Location = new System.Drawing.Point(543, -1);
            this.TopRightCornerPanel.Name = "TopRightCornerPanel";
            this.TopRightCornerPanel.Size = new System.Drawing.Size(2, 2);
            this.TopRightCornerPanel.TabIndex = 13;
            // 
            // BottomLeftCornerPanel
            // 
            this.BottomLeftCornerPanel.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.BottomLeftCornerPanel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(43)))), ((int)(((byte)(87)))), ((int)(((byte)(154)))));
            this.BottomLeftCornerPanel.Cursor = System.Windows.Forms.Cursors.SizeNESW;
            this.BottomLeftCornerPanel.Location = new System.Drawing.Point(0, 417);
            this.BottomLeftCornerPanel.Name = "BottomLeftCornerPanel";
            this.BottomLeftCornerPanel.Size = new System.Drawing.Size(2, 2);
            this.BottomLeftCornerPanel.TabIndex = 14;
            // 
            // BottomRightCornerPanel
            // 
            this.BottomRightCornerPanel.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.BottomRightCornerPanel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(43)))), ((int)(((byte)(87)))), ((int)(((byte)(154)))));
            this.BottomRightCornerPanel.Cursor = System.Windows.Forms.Cursors.SizeNWSE;
            this.BottomRightCornerPanel.Location = new System.Drawing.Point(543, 417);
            this.BottomRightCornerPanel.Name = "BottomRightCornerPanel";
            this.BottomRightCornerPanel.Size = new System.Drawing.Size(2, 2);
            this.BottomRightCornerPanel.TabIndex = 15;
            // 
            // TopLeftCornerPanel
            // 
            this.TopLeftCornerPanel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(43)))), ((int)(((byte)(87)))), ((int)(((byte)(154)))));
            this.TopLeftCornerPanel.Cursor = System.Windows.Forms.Cursors.SizeNWSE;
            this.TopLeftCornerPanel.Location = new System.Drawing.Point(0, -1);
            this.TopLeftCornerPanel.Name = "TopLeftCornerPanel";
            this.TopLeftCornerPanel.Size = new System.Drawing.Size(2, 2);
            this.TopLeftCornerPanel.TabIndex = 12;
            // 
            // MinimizeLabel
            // 
            this.MinimizeLabel.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.MinimizeLabel.BackColor = System.Drawing.Color.Black;
            this.MinimizeLabel.Font = new System.Drawing.Font("Marlett", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.MinimizeLabel.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(224)))), ((int)(((byte)(192)))));
            this.MinimizeLabel.Location = new System.Drawing.Point(514, 0);
            this.MinimizeLabel.Name = "MinimizeLabel";
            this.MinimizeLabel.Size = new System.Drawing.Size(12, 24);
            this.MinimizeLabel.TabIndex = 20;
            this.MinimizeLabel.Text = "0";
            this.MinimizeLabel.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.DecorationToolTip.SetToolTip(this.MinimizeLabel, "Minimize");
            // 
            // CloseLabel
            // 
            this.CloseLabel.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.CloseLabel.BackColor = System.Drawing.Color.Black;
            this.CloseLabel.Font = new System.Drawing.Font("Marlett", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.CloseLabel.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(224)))), ((int)(((byte)(192)))));
            this.CloseLabel.Location = new System.Drawing.Point(529, 0);
            this.CloseLabel.Name = "CloseLabel";
            this.CloseLabel.Size = new System.Drawing.Size(12, 24);
            this.CloseLabel.TabIndex = 21;
            this.CloseLabel.Text = "r";
            this.CloseLabel.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.DecorationToolTip.SetToolTip(this.CloseLabel, "Close");
            // 
            // HostForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.ClientSize = new System.Drawing.Size(544, 419);
            this.ControlBox = false;
            this.Controls.Add(this.browser);
            this.Controls.Add(this.RightBorderPanel);
            this.Controls.Add(this.LeftBorderPanel);
            this.Controls.Add(this.BottomBorderPanel);
            this.Controls.Add(this.TopBorderPanel);
            this.Controls.Add(this.TopRightCornerPanel);
            this.Controls.Add(this.BottomLeftCornerPanel);
            this.Controls.Add(this.BottomRightCornerPanel);
            this.Controls.Add(this.TopLeftCornerPanel);
            this.Controls.Add(this.MinimizeLabel);
            this.Controls.Add(this.CloseLabel);
            this.Controls.Add(this.TitleLabel);
            this.ForeColor = System.Drawing.Color.White;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Location = new System.Drawing.Point(0, 0);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "HostForm";
            this.ShowInTaskbar = false;
            this.Text = "Form";
            this.TopMost = true;
            this.Shown += new System.EventHandler(this.HostForm_Shown);
            this.MouseEnter += new System.EventHandler(this.HostForm_MouseEnter);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.WebBrowser browser;
        private System.Windows.Forms.NotifyIcon notifyIcon;
        private System.Windows.Forms.Label TitleLabel;
        private System.Windows.Forms.Panel RightBorderPanel;
        private System.Windows.Forms.Panel LeftBorderPanel;
        private System.Windows.Forms.Panel BottomBorderPanel;
        private System.Windows.Forms.Panel TopBorderPanel;
        private System.Windows.Forms.Panel TopRightCornerPanel;
        private System.Windows.Forms.Panel BottomLeftCornerPanel;
        private System.Windows.Forms.Panel BottomRightCornerPanel;
        private System.Windows.Forms.Panel TopLeftCornerPanel;
        private System.Windows.Forms.ToolTip DecorationToolTip;
        private System.Windows.Forms.Label MinimizeLabel;
        private System.Windows.Forms.Label CloseLabel;
        private System.Windows.Forms.Timer timer;
    }
}

