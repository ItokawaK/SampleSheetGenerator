# SampleSheetGenerator

Easy-to-use sample-sheet generator for illumina by html and JS.

GitHub Pages: https://itokawak.github.io/SampleSheetGenerator/

### About
I created this tool for personal frustration to the illumina's LocalRunManger/BaseSpace, which are not very useful. Also they do not include QIAgene QiaSeqFX UDI kit indexes in default.

- This tool creates a SampleSheet **which has at least enough information** required to basecall bcl and demultiplex by bcl2fastq, Dragen server in NS2000/1000 and LocalRunManager in instruments.
- The software consists of static html/css and javascript.
- Basic usage is just copying & pasting sample IDs arranged as plate position in Excel to the textbox.
- Created SampleSheet CSV can be used directly to bcl2fastq or import to run mangers of illumina instruments.
- You can also check whether there is a pre-used ID from old SampleSheet CSVs.
- This is a client-side app. The information you input would not be submitted to anywhere. Everything happens within your PC.  
- Currently, not all platforms of illumina and library kits are supported. Please check whether the generated SampleSheets are valid to your platform before use.
- The author is not liable to any troubles or damages caused by this software. Please use it at your own risk.
