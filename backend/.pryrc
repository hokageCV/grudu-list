# https://forum.shakacode.com/t/my-pryrc-for-debugging-and-productivity/364
# help alias: lists all alias

Pry.commands.alias_command 'c', 'continue' rescue nil
Pry.commands.alias_command 's', 'step' rescue nil
Pry.commands.alias_command 'n', 'next' rescue nil


