struct data_index_pair {
	index: i32,
	data: u32,
}

@group(0)
@binding(0)
var<storage, read_write> mem: array<u32>;

@group(0)
@binding(1)
var<storage, read_write> uninit_vars: array<i32>;

@group(0)
@binding(2)
var<storage, read_write> index_buf: array<i32>;

@group(0)
@binding(3)
var<storage, read_write> data_buf: array<u32>;

@group(0)
@binding(4)
var<storage, read_write> output_buf: array<data_index_pair>;

@group(0)
@binding(5)
var<storage, read_write> debug: array<u32>;

var<workgroup> workgroup_buf: array<u32, 256>;

@compute
@workgroup_size(9)
fn main(@builtin(num_workgroups) num_workgroups: vec3<u32>, @builtin(global_invocation_id) global_invocation_id: vec3<u32>, @builtin(local_invocation_id) local_invocation_id: vec3<u32>) {
	var local_data: array<u32, 8>;
	let total_ids = num_workgroups.x * 9u;
	let pattern_index = global_invocation_id.x * 1u;
	var var_1: u32 = 2u;
	var var_3: u32 = 2u;
	var var_6: u32 = 2u;
	var var_9: u32 = 2u;
	var var_11: u32 = 2u;
	var var_13: u32 = 2u;
	var var_15: u32 = 2u;
	var var_18: u32 = 2u;
	var var_19: u32 = 2u;
	var var_20: u32 = 2u;
	var var_21: u32 = 2u;
	var var_22: u32 = 2u;
	var var_23: u32 = 2u;
	var var_24: u32 = 2u;
	var var_26: u32 = 2u;
	var var_27: u32 = 2u;
	var var_28: u32 = 2u;
	var var_31: u32 = 2u;
	var var_32: u32 = 2u;
	var var_33: u32 = 2u;
	var var_34: u32 = 2u;
	var var_35: u32 = 2u;
	var var_39: u32 = 2u;
	var var_40: u32 = 2u;
	var var_41: u32 = 2u;
	var var_42: u32 = 2u;
	var var_43: u32 = 2u;
	var var_44: u32 = 2u;
	var var_46: u32 = 2u;
	var var_48: u32 = 2u;
	var var_52: u32 = 2u;
	var var_54: u32 = 2u;
	var var_58: u32 = 2u;
	var var_59: u32 = 2u;
	var var_60: u32 = 2u;
	var var_61: u32 = 2u;
	var var_62: u32 = 2u;
	var var_63: u32 = 2u;
	var var_64: u32 = 2u;
	var var_67: u32 = 2u;
	var var_68: u32 = 2u;
	var var_69: u32 = 2u;
	var var_70: u32 = 2u;
	var var_71: u32 = 2u;
	var var_73: u32 = 2u;
	var var_74: u32 = 2u;
	var var_76: u32 = 2u;
	var var_78: u32 = 2u;
	var var_80: u32 = 2u;
	var var_83: u32 = 2u;
	var var_87: u32 = 2u;
	var var_88: u32 = 2u;
	var var_91: u32 = 2u;
	var var_96: u32 = 2u;
	var var_99: u32 = 2u;
	var var_100: u32 = 2u;
	var var_101: u32 = 2u;
	var var_104: u32 = 2u;
	var var_105: u32 = 2u;
	var var_106: u32 = 2u;
	var var_107: u32 = 2u;
	var var_108: u32 = 2u;
	var var_113: u32 = 2u;
	var var_115: u32 = 2u;
	var var_118: u32 = 2u;
	var var_119: u32 = 2u;
	var var_121: u32 = 2u;
	var var_123: u32 = 2u;
	var var_124: u32 = 2u;
	var var_127: u32 = 2u;
	var var_128: u32 = 2u;
	var var_130: u32 = 2u;
	var var_131: u32 = 2u;
	var var_132: u32 = 2u;
	var var_134: u32 = 2u;
	var var_136: u32 = 2u;
	var var_139: u32 = 2u;
	var var_140: u32 = 2u;
	var var_142: u32 = 2u;
	var var_144: u32 = 2u;
	var var_145: u32 = 2u;
	var var_146: u32 = 2u;
	var var_150: u32 = 2u;
	var var_151: u32 = 2u;
	var var_152: u32 = 2u;
	var var_154: u32 = 2u;
	var var_155: u32 = 2u;
	var var_159: u32 = 2u;
	var var_160: u32 = 2u;
	var var_161: u32 = 2u;
	var var_163: u32 = 2u;
	var var_164: u32 = 2u;
	var var_165: u32 = 2u;
	var var_170: u32 = 2u;
	var var_171: u32 = 2u;
	var var_173: u32 = 2u;
	var var_175: u32 = 2u;
	var var_176: u32 = 2u;
	var var_177: u32 = 2u;
	var var_178: u32 = 2u;
	var var_179: u32 = 2u;
	var var_180: u32 = 2u;
	var var_181: u32 = 2u;
	var var_182: u32 = 2u;
	var var_183: u32 = 2u;
	var var_184: u32 = 2u;
	var var_185: u32 = 2u;
	var var_186: u32 = 2u;
	var var_188: u32 = 2u;
	var var_189: u32 = 2u;
	var var_190: u32 = 2u;
	var var_192: u32 = 2u;
	var var_193: u32 = 2u;
	var var_194: u32 = 2u;
	var var_195: u32 = 2u;
	var var_197: u32 = 2u;
	var var_198: u32 = 2u;
	var var_199: u32 = 2u;
	var var_200: u32 = 2u;
	var var_204: u32 = 2u;
	var var_205: u32 = 2u;
	var var_212: u32 = 2u;
	var var_213: u32 = 2u;
	var var_215: u32 = 2u;
	var var_216: u32 = 2u;
	var var_217: u32 = 2u;
	var var_218: u32 = 2u;
	var var_221: u32 = 2u;
	var var_223: u32 = 2u;
	var var_224: u32 = 2u;
	var var_225: u32 = 2u;
	var var_227: u32 = 2u;
	var var_228: u32 = 2u;
	var var_229: u32 = 2u;
	var var_230: u32 = 2u;
	var var_234: u32 = 2u;
	var var_235: u32 = 2u;
	var var_236: u32 = 2u;
	var var_240: u32 = 2u;
	var var_241: u32 = 2u;
	var var_242: u32 = 2u;
	var var_244: u32 = 2u;
	var var_246: u32 = 2u;
	var var_250: u32 = 2u;
	var var_251: u32 = 2u;
	var var_252: u32 = 2u;
	var var_253: u32 = 2u;
	var var_254: u32 = 2u;
	var var_255: u32 = 2u;
	var var_258: u32 = 2u;
	var var_262: u32 = 2u;
	var var_263: u32 = 2u;
	var var_265: u32 = 2u;
	var var_267: u32 = 2u;
	var var_268: u32 = 2u;
	var var_270: u32 = 2u;
	var var_271: u32 = 2u;
	var var_272: u32 = 2u;
	var var_0: u32 = 2u;
	var var_2: u32 = 2u;
	var var_4: u32 = 2u;
	var var_5: u32 = 2u;
	var var_7: u32 = 2u;
	var var_8: u32 = 2u;
	var var_10: u32 = 2u;
	var var_12: u32 = 2u;
	var var_14: u32 = 2u;
	var var_16: u32 = 2u;
	var var_17: u32 = 2u;
	var var_25: u32 = 2u;
	var var_29: u32 = 2u;
	var var_30: u32 = 2u;
	var var_36: u32 = 2u;
	var var_37: u32 = 2u;
	var var_38: u32 = 2u;
	var var_45: u32 = 2u;
	var var_47: u32 = 2u;
	var var_49: u32 = 2u;
	var var_50: u32 = 2u;
	var var_51: u32 = 2u;
	var var_53: u32 = 2u;
	var var_55: u32 = 2u;
	var var_56: u32 = 2u;
	var var_57: u32 = 2u;
	var var_65: u32 = 2u;
	var var_66: u32 = 2u;
	var var_72: u32 = 2u;
	var var_75: u32 = 2u;
	var var_77: u32 = 2u;
	var var_79: u32 = 2u;
	var var_81: u32 = 2u;
	var var_82: u32 = 2u;
	var var_84: u32 = 2u;
	var var_85: u32 = 2u;
	var var_86: u32 = 2u;
	var var_89: u32 = 2u;
	var var_90: u32 = 2u;
	var var_92: u32 = 2u;
	var var_93: u32 = 2u;
	var var_94: u32 = 2u;
	var var_95: u32 = 2u;
	var var_97: u32 = 2u;
	var var_98: u32 = 2u;
	var var_102: u32 = 2u;
	var var_103: u32 = 2u;
	var var_109: u32 = 2u;
	var var_110: u32 = 2u;
	var var_111: u32 = 2u;
	var var_112: u32 = 2u;
	var var_114: u32 = 2u;
	var var_116: u32 = 2u;
	var var_117: u32 = 2u;
	var var_120: u32 = 2u;
	var var_122: u32 = 2u;
	var var_125: u32 = 2u;
	var var_126: u32 = 2u;
	var var_129: u32 = 2u;
	var var_133: u32 = 2u;
	var var_135: u32 = 2u;
	var var_137: u32 = 2u;
	var var_138: u32 = 2u;
	var var_141: u32 = 2u;
	var var_143: u32 = 2u;
	var var_147: u32 = 2u;
	var var_148: u32 = 2u;
	var var_149: u32 = 2u;
	var var_153: u32 = 2u;
	var var_156: u32 = 2u;
	var var_157: u32 = 2u;
	var var_158: u32 = 2u;
	var var_162: u32 = 2u;
	var var_166: u32 = 2u;
	var var_167: u32 = 2u;
	var var_168: u32 = 2u;
	var var_169: u32 = 2u;
	var var_172: u32 = 2u;
	var var_174: u32 = 2u;
	var var_187: u32 = 2u;
	var var_191: u32 = 2u;
	var var_196: u32 = 2u;
	var var_201: u32 = 2u;
	var var_202: u32 = 2u;
	var var_203: u32 = 2u;
	var var_206: u32 = 2u;
	var var_207: u32 = 2u;
	var var_208: u32 = 2u;
	var var_209: u32 = 2u;
	var var_210: u32 = 2u;
	var var_211: u32 = 2u;
	var var_214: u32 = 2u;
	var var_219: u32 = 2u;
	var var_220: u32 = 2u;
	var var_222: u32 = 2u;
	var var_226: u32 = 2u;
	var var_231: u32 = 2u;
	var var_232: u32 = 2u;
	var var_233: u32 = 2u;
	var var_237: u32 = 2u;
	var var_238: u32 = 2u;
	var var_239: u32 = 2u;
	var var_243: u32 = 2u;
	var var_245: u32 = 2u;
	var var_247: u32 = 2u;
	var var_248: u32 = 2u;
	var var_249: u32 = 2u;
	var var_256: u32 = 2u;
	var var_257: u32 = 2u;
	var var_259: u32 = 2u;
	var var_260: u32 = 2u;
	var var_261: u32 = 2u;
	var var_264: u32 = 2u;
	var var_266: u32 = 2u;
	var var_269: u32 = 2u;
	var uninit_var_0: i32;
	var uninit_var_1: i32;
	var uninit_var_2: i32;
	var uninit_var_3: i32;
	var uninit_var_4: i32;
	(uninit_vars)[(global_invocation_id.x * 5u) + 0u] = uninit_var_0;
	(uninit_vars)[(global_invocation_id.x * 5u) + 1u] = uninit_var_1;
	(uninit_vars)[(global_invocation_id.x * 5u) + 2u] = uninit_var_2;
	(uninit_vars)[(global_invocation_id.x * 5u) + 3u] = uninit_var_3;
	(uninit_vars)[(global_invocation_id.x * 5u) + 4u] = uninit_var_4;
	if (local_invocation_id.x < 2u) {
    (workgroup_buf)[0u] = 0u;
}
	(mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((((((((var_1 + var_3) + var_6) + var_9) + var_11) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31) + var_32;
	var_134 = (((((((((((((((((20u + mem[(global_invocation_id.x * 9u) + 3u]) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171) + var_173) + var_175) + var_176) + var_177) + var_178) + var_179) + var_180) + var_181) + var_182) + var_183) + var_184;
	var_150 = ((((((mem[(global_invocation_id.x * 9u) + 8u] + 24u) + var_197) + var_198) + var_199) + var_200) + var_204) + var_205;
	var_221 = mem[(global_invocation_id.x * 9u) + 3u] + mem[(global_invocation_id.x * 9u) + 3u];
	var_46 = (((((mem[0u] + var_212) + var_213) + var_215) + var_216) + var_217) + var_218;
	(mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((((mem[0u] + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236) + var_240) + var_241) + var_242;
	if (mem[(global_invocation_id.x * 9u) + 3u] > mem[0u]) {
    (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((((0u + var_270) + var_271) + var_272) + var_1) + var_3) + var_6) + var_9) + var_11) + var_13) + var_15) + var_18;
    var_270 = (((((((((((((((((((mem[0u] + mem[0u]) + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31) + var_32) + var_33) + var_34) + var_35) + var_39) + var_40) + var_41) + var_42) + var_43;
    if (mem[(global_invocation_id.x * 9u) + 8u] < 2u) {
        (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((((((((24u + 10u) + var_44) + var_46) + var_48) + var_52) + var_54) + var_58) + var_59) + var_60) + var_61) + var_62) + var_63) + var_64) + var_67) + var_68) + var_69) + var_70;
        (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((2u + var_71) + var_73) + var_74) + var_76) + var_78) + var_80) + var_83) + var_87;
    }
} else {
    var_184 = ((((((((((((((((2u + 14u) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171) + var_173) + var_175) + var_176) + var_177) + var_178) + var_179) + var_180) + var_181;
    for (var i_3: u32 = min(0u, 10u); i_3 > 0u; i_3 = i_3 - 1u) {
        var_204 = ((((((((var_200 + 12u) + 22u) + var_204) + var_205) + var_212) + var_213) + var_215) + var_216) + var_217;
        var_192 = ((((((((((((((mem[0u] + var_218) + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236) + var_240) + var_241) + var_242;
        var_192 = (((((((((((10u + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258) + var_262) + var_263) + var_265;
        var_254 = ((((((14u + var_15) + var_18) + var_19) + var_20) + var_21) + var_22) + var_23;
        (mem)[(global_invocation_id.x * 9u) + 8u] = var_24 + 12u;
        var_151 = ((((((((((0u + 12u) + var_74) + var_76) + var_78) + var_80) + var_83) + var_87) + var_88) + var_91) + var_96) + var_99;
        (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((((((((((mem[0u] + 6u) + mem[(global_invocation_id.x * 9u) + 3u]) + var_121) + var_123) + var_124) + var_127) + var_128) + var_130) + var_131) + var_132) + var_134) + var_136) + var_139) + var_140) + var_142) + var_144) + var_145) + var_146) + var_150;
        var_186 = (((((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_151) + var_152) + var_154) + var_155) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171;
        (mem)[(global_invocation_id.x * 9u) + 8u] = 18u + 4u;
        var_195 = ((((((((((var_178 + mem[(global_invocation_id.x * 9u) + 8u]) + var_179) + var_180) + var_181) + var_182) + var_183) + var_184) + var_185) + var_186) + var_188) + var_189;
        (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((((var_235 + var_236) + var_240) + var_241) + var_242) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258;
        var_171 = ((((((var_265 + 22u) + var_267) + var_268) + var_270) + var_271) + var_272) + var_1;
        (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 3u]) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31) + var_32) + var_33) + var_34;
        (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((20u + mem[0u]) + var_40) + var_41) + var_42) + var_43) + var_44) + var_46) + var_48) + var_52) + var_54) + var_58;
    }
    var_40 = ((((((var_134 + 8u) + var_136) + var_139) + var_140) + var_142) + var_144) + var_145;
}
	var_223 = (((((((((((8u + mem[(global_invocation_id.x * 9u) + 8u]) + var_151) + var_152) + var_154) + var_155) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170;
	var_128 = ((((((((((((((((((var_213 + var_215) + var_216) + var_217) + var_218) + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236) + var_240) + var_241) + var_242) + var_244;
	var_221 = ((((((var_180 + mem[0u]) + var_181) + var_182) + var_183) + var_184) + var_185) + var_186;
	(mem)[(global_invocation_id.x * 9u) + 8u] = ((10u + mem[(global_invocation_id.x * 9u) + 3u]) + mem[0u]) + var_188;
	var_142 = (((((((var_228 + var_229) + var_230) + var_234) + var_235) + var_236) + var_240) + var_241) + var_242;
	if (mem[(global_invocation_id.x * 9u) + 8u] < 22u) {
    if (mem[(global_invocation_id.x * 9u) + 3u] > mem[0u]) {
        (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((((((((((mem[0u] + 4u) + var_272) + var_1) + var_3) + var_6) + var_9) + var_11) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31;
        var_144 = (((((var_32 + 20u) + var_33) + var_34) + var_35) + var_39) + var_40;
        for (var i_3: u32 = min(6u, 10u); i_3 > 0u; i_3 = i_3 - 1u) {
            var_253 = (((((((((((((((mem[0u] + var_42) + var_43) + var_44) + var_46) + var_48) + var_52) + var_54) + var_58) + var_59) + var_60) + var_61) + var_62) + var_63) + var_64) + var_67) + var_68;
        }
    }
} else {
    (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((((((((((20u + mem[0u]) + var_69) + var_70) + var_71) + var_73) + var_74) + var_76) + var_78) + var_80) + var_83) + var_87) + var_88) + var_91) + var_96) + var_99) + var_100) + var_101) + var_104) + var_105;
    (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((((((((((((mem[0u] + var_106) + var_107) + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127) + var_128) + var_130) + var_131) + var_132) + var_134) + var_136) + var_139) + var_140;
    (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((((((((mem[(global_invocation_id.x * 9u) + 8u] + var_142) + mem[(global_invocation_id.x * 9u) + 8u]) + var_144) + var_145) + var_146) + var_150) + var_151) + var_152) + var_154) + var_155) + var_159) + var_160) + var_161) + var_163) + var_164;
    (mem)[(global_invocation_id.x * 9u) + 8u] = (((((var_165 + var_170) + 6u) + var_171) + var_173) + var_175) + var_176;
}
	var_28 = (((((((((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 8u]) + var_188) + var_189) + var_190) + var_192) + var_193) + var_194) + var_195) + var_197) + var_198) + var_199) + var_200) + var_204) + var_205) + var_212) + var_213;
	for (var i_1: u32 = min(6u, 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    var_9 = ((mem[(global_invocation_id.x * 9u) + 8u] + var_215) + var_216) + var_217;
    var_170 = ((((((((8u + var_218) + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230;
    (mem)[(global_invocation_id.x * 9u) + 8u] = ((mem[0u] + var_234) + var_235) + var_236;
    (mem)[(global_invocation_id.x * 9u) + 8u] = (((((((((((((((((((var_240 + 16u) + var_241) + var_242) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258) + var_262) + var_263) + var_265) + var_267) + var_268) + var_270) + var_271) + var_272;
}
	(mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((6u + mem[(global_invocation_id.x * 9u) + 3u]) + var_136) + var_139) + var_140) + var_142) + var_144) + var_145) + var_146) + var_150) + var_151) + var_152;
	var_21 = (((var_179 + var_180) + var_181) + var_182) + var_183;
	var_268 = ((4u + mem[(global_invocation_id.x * 9u) + 8u]) + var_184) + var_185;
	for (var i_1: u32 = min(mem[(global_invocation_id.x * 9u) + 3u], 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    var_131 = ((((((((((((((mem[0u] + 18u) + var_186) + var_188) + var_189) + var_190) + var_192) + var_193) + var_194) + var_195) + var_197) + var_198) + var_199) + var_200) + var_204) + var_205;
    var_252 = ((((((((((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 8u]) + var_216) + var_217) + var_218) + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236) + var_240) + var_241;
    (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((var_242 + 0u) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255;
    if (var_258 > var_262) {
        (mem)[(global_invocation_id.x * 9u) + 3u] = var_263 + 6u;
        for (var i_3: u32 = min(var_265, 10u); i_3 > 0u; i_3 = i_3 - 1u) {
            var_194 = ((((((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 8u]) + var_268) + var_270) + var_271) + var_272) + var_1) + var_3) + var_6) + var_9) + var_11) + var_13) + var_15) + var_18;
            var_48 = (((((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31) + var_32) + var_33) + var_34) + var_35) + var_39) + var_40;
            var_204 = (((2u + mem[0u]) + var_54) + var_58) + var_59;
            var_18 = ((((((((var_60 + mem[0u]) + var_61) + var_62) + var_63) + var_64) + var_67) + var_68) + var_69) + var_70;
            var_213 = (((((((mem[(global_invocation_id.x * 9u) + 3u] + mem[0u]) + var_99) + var_100) + var_101) + var_104) + var_105) + var_106) + var_107;
            var_170 = ((((((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_124) + var_127) + var_128) + var_130) + var_131) + var_132) + var_134) + var_136) + var_139) + var_140) + var_142) + var_144) + var_145) + var_146) + var_150) + var_151) + var_152;
            var_123 = (((((((20u + var_163) + 0u) + var_164) + var_165) + var_170) + var_171) + var_173) + var_175;
            (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((12u + mem[0u]) + var_181) + var_182) + var_183) + var_184) + var_185) + var_186) + var_188) + var_189) + var_190) + var_192;
            (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_193) + mem[0u]) + var_194) + var_195) + var_197) + var_198) + var_199) + var_200) + var_204) + var_205) + var_212) + var_213;
            (mem)[(global_invocation_id.x * 9u) + 8u] = (((((((((((((((mem[0u] + 0u) + var_215) + var_216) + var_217) + var_218) + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236;
            var_18 = (((((((mem[(global_invocation_id.x * 9u) + 8u] + 8u) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258;
            var_213 = 16u + mem[0u];
            var_197 = ((((((var_262 + mem[(global_invocation_id.x * 9u) + 3u]) + var_263) + var_265) + var_267) + var_268) + var_270) + var_271;
            (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_32) + var_33) + var_34) + var_35) + var_39) + var_40) + var_41) + var_42) + var_43) + var_44) + var_46) + var_48) + var_52;
            (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((((16u + 20u) + mem[0u]) + var_58) + var_59) + var_60) + var_61) + var_62) + var_63) + var_64) + var_67) + var_68) + var_69) + var_70) + var_71;
            var_19 = ((2u + mem[0u]) + 12u) + var_73;
            (mem)[(global_invocation_id.x * 9u) + 3u] = var_74 + var_76;
            (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((((((var_78 + var_80) + var_83) + var_87) + var_88) + var_91) + var_96) + var_99) + var_100) + var_101) + var_104) + var_105) + var_106) + var_107) + var_108) + var_113) + var_115;
        }
    }
    (mem)[(global_invocation_id.x * 9u) + 8u] = (((((((((((((12u + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171) + var_173) + var_175) + var_176) + var_177) + var_178) + var_179;
}
	for (var i_1: u32 = min(mem[(global_invocation_id.x * 9u) + 8u], 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    var_139 = var_13 + mem[(global_invocation_id.x * 9u) + 3u];
    for (var i_2: u32 = min(var_15, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
        var_263 = (var_54 + var_58) + var_59;
        if (var_60 > 10u) {
            var_131 = (((24u + 14u) + var_61) + var_62) + var_63;
            (mem)[(global_invocation_id.x * 9u) + 8u] = ((var_131 + var_132) + var_134) + var_136;
            var_28 = (((((((((((18u + var_164) + var_165) + var_170) + var_171) + var_173) + var_175) + var_176) + var_177) + var_178) + var_179) + var_180) + var_181;
            var_73 = (((((((var_193 + var_194) + var_195) + var_197) + var_198) + var_199) + var_200) + var_204) + var_205;
            var_78 = (((((((((((((((mem[0u] + var_230) + var_234) + var_235) + var_236) + var_240) + var_241) + var_242) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258;
            var_150 = (6u + 0u) + var_262;
            var_175 = (((((((((((((((((mem[0u] + mem[0u]) + var_1) + var_3) + var_6) + var_9) + var_11) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28;
            var_189 = ((((((((((8u + var_31) + mem[(global_invocation_id.x * 9u) + 8u]) + var_32) + var_33) + var_34) + var_35) + var_39) + var_40) + var_41) + var_42) + var_43;
            (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((2u + 6u) + var_44) + var_46) + var_48) + var_52) + var_54) + var_58) + var_59) + var_60) + var_61) + var_62;
            var_178 = ((((((((((((((((((24u + mem[0u]) + var_96) + var_99) + var_100) + var_101) + var_104) + var_105) + var_106) + var_107) + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127) + var_128;
            var_183 = ((((((((((((((((((var_155 + 6u) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171) + var_173) + var_175) + var_176) + var_177) + var_178) + var_179) + var_180) + var_181) + var_182) + var_183;
            var_34 = ((((((((((((((((((((var_184 + 16u) + var_185) + var_186) + var_188) + var_189) + var_190) + var_192) + var_193) + var_194) + var_195) + var_197) + var_198) + var_199) + var_200) + var_204) + var_205) + var_212) + var_213) + var_215) + var_216) + var_217;
            (mem)[(global_invocation_id.x * 9u) + 3u] = (((((var_229 + var_230) + var_234) + var_235) + var_236) + var_240) + var_241;
            var_107 = ((((((((((((((((mem[0u] + var_262) + var_263) + var_265) + var_267) + var_268) + var_270) + var_271) + var_272) + var_1) + var_3) + var_6) + var_9) + var_11) + var_13) + var_15) + var_18) + var_19;
            var_48 = (((((((((((((12u + mem[0u]) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31) + var_32) + var_33) + var_34) + var_35;
            var_185 = ((((((8u + mem[(global_invocation_id.x * 9u) + 3u]) + var_39) + var_40) + var_41) + var_42) + var_43) + var_44;
            var_253 = (((((((((mem[(global_invocation_id.x * 9u) + 3u] + 22u) + var_99) + var_100) + var_101) + var_104) + var_105) + var_106) + var_107) + var_108) + var_113;
        }
    }
}
	var_105 = ((((((18u + var_140) + var_142) + var_144) + var_145) + var_146) + var_150) + var_151;
	for (var i_1: u32 = min(mem[0u], 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    var_170 = (((((((((((((mem[0u] + var_60) + var_61) + var_62) + var_63) + var_64) + var_67) + var_68) + var_69) + var_70) + var_71) + var_73) + var_74) + var_76) + var_78;
    var_132 = (((((24u + var_80) + var_83) + var_87) + var_88) + var_91) + var_96;
    var_101 = (((0u + var_99) + var_100) + var_101) + var_104;
}
	var_182 = ((((((((((var_107 + 16u) + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127) + var_128;
	var_197 = ((((((((((((((((((16u + var_155) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171) + var_173) + var_175) + var_176) + var_177) + var_178) + var_179) + var_180) + var_181) + var_182) + var_183;
	if (0u > mem[0u]) {
    var_3 = (((((((((((((mem[0u] + var_39) + var_40) + var_41) + var_42) + var_43) + var_44) + var_46) + var_48) + var_52) + var_54) + var_58) + var_59) + var_60) + var_61;
    var_155 = (((((var_62 + mem[(global_invocation_id.x * 9u) + 8u]) + var_63) + var_64) + var_67) + var_68) + var_69;
} else {
    (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((var_107 + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127;
}
	var_144 = (((((((((((((((mem[(global_invocation_id.x * 9u) + 8u] + var_145) + var_146) + var_150) + var_151) + var_152) + var_154) + var_155) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171) + var_173;
	for (var i_1: u32 = min(20u, 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    var_242 = (((((((((((((((22u + mem[0u]) + var_175) + var_176) + var_177) + var_178) + var_179) + var_180) + var_181) + var_182) + var_183) + var_184) + var_185) + var_186) + var_188) + var_189) + var_190;
    var_212 = (((((mem[(global_invocation_id.x * 9u) + 8u] + 18u) + var_204) + var_205) + var_212) + var_213) + var_215;
    var_182 = (((((mem[(global_invocation_id.x * 9u) + 8u] + var_241) + var_242) + var_244) + var_246) + var_250) + var_251;
}
	(mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_181) + var_182) + var_183) + var_184) + var_185) + var_186) + var_188) + var_189) + var_190;
	var_115 = (((((((mem[0u] + mem[0u]) + var_192) + var_193) + var_194) + var_195) + var_197) + var_198) + var_199;
	for (var i_1: u32 = min(var_200, 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    var_235 = ((((((((((((((((22u + var_205) + var_212) + var_213) + var_215) + var_216) + var_217) + var_218) + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235;
}
	var_1 = ((((((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + mem[(global_invocation_id.x * 9u) + 3u]) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236) + var_240) + var_241) + var_242) + var_244) + var_246) + var_250;
	if (14u < var_251) {
    if (12u > var_252) {
    } else {
        if (22u < var_83) {
            var_161 = ((((((((mem[(global_invocation_id.x * 9u) + 8u] + var_121) + var_123) + var_124) + var_127) + var_128) + var_130) + var_131) + var_132) + var_134;
            (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((mem[(global_invocation_id.x * 9u) + 3u] + mem[(global_invocation_id.x * 9u) + 3u]) + mem[0u]) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236;
            var_34 = ((((((((((((((((18u + mem[(global_invocation_id.x * 9u) + 3u]) + var_240) + var_241) + var_242) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258) + var_262) + var_263) + var_265) + var_267;
        }
    }
} else {
    for (var i_2: u32 = min(14u, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
        var_107 = (((((((((var_19 + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31) + var_32;
        if (2u > mem[0u]) {
            var_246 = (12u + var_91) + var_96;
            var_183 = ((((((((((((((((0u + 20u) + var_136) + var_139) + var_140) + var_142) + var_144) + var_145) + var_146) + var_150) + var_151) + var_152) + var_154) + var_155) + var_159) + var_160) + var_161) + var_163;
            var_104 = (((2u + 0u) + var_165) + var_170) + var_171;
            var_216 = ((((((((var_175 + mem[(global_invocation_id.x * 9u) + 3u]) + var_176) + var_177) + var_178) + var_179) + var_180) + var_181) + var_182) + var_183;
            var_3 = ((((mem[0u] + var_213) + var_215) + var_216) + var_217) + var_218;
            var_67 = ((((((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 3u]) + var_236) + var_240) + var_241) + var_242) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255;
            (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((var_258 + var_262) + var_263) + var_265) + var_267) + var_268) + var_270) + var_271) + var_272) + var_1) + var_3) + var_6;
            var_199 = (((((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + mem[0u]) + var_9) + var_11) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31;
        }
    }
}
	var_69 = ((((var_34 + var_35) + var_39) + var_40) + var_41) + var_42;
	var_252 = (((((((6u + var_46) + var_48) + var_52) + var_54) + var_58) + var_59) + var_60) + var_61;
	(mem)[(global_invocation_id.x * 9u) + 8u] = ((((((16u + var_78) + var_80) + var_83) + var_87) + var_88) + var_91) + var_96;
	for (var i_1: u32 = min(var_99, 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((var_106 + var_107) + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124;
}
	for (var i_1: u32 = min(20u, 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    var_270 = (((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_91) + var_96) + var_99) + var_100) + var_101) + var_104) + var_105) + var_106) + var_107) + var_108) + var_113) + var_115) + var_118) + var_119;
    for (var i_2: u32 = min(8u, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
        (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((((((((((mem[0u] + var_130) + var_131) + var_132) + var_134) + var_136) + var_139) + var_140) + var_142) + var_144) + var_145) + var_146) + var_150) + var_151) + var_152) + var_154) + var_155) + var_159;
    }
}
	var_87 = ((mem[(global_invocation_id.x * 9u) + 8u] + mem[(global_invocation_id.x * 9u) + 3u]) + var_32) + var_33;
	for (var i_1: u32 = min(mem[(global_invocation_id.x * 9u) + 3u], 10u); i_1 > 0u; i_1 = i_1 - 1u) {
}
	var_88 = var_35;
	var_74 = ((((18u + 12u) + var_39) + var_40) + var_41) + var_42;
	(mem)[(global_invocation_id.x * 9u) + 8u] = ((var_70 + var_71) + var_73) + var_74;
	var_28 = (((((20u + mem[(global_invocation_id.x * 9u) + 8u]) + 14u) + var_76) + var_78) + var_80) + var_83;
	for (var i_2: u32 = min(var_105, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
    var_272 = ((((((((((((((var_106 + var_107) + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127) + var_128) + var_130) + var_131) + var_132) + var_134;
    for (var i_3: u32 = min(mem[(global_invocation_id.x * 9u) + 8u], 10u); i_3 > 0u; i_3 = i_3 - 1u) {
        var_234 = (((mem[(global_invocation_id.x * 9u) + 3u] + var_52) + var_54) + var_58) + var_59;
        (mem)[(global_invocation_id.x * 9u) + 8u] = (((((((((((((((((mem[(global_invocation_id.x * 9u) + 8u] + 8u) + var_71) + var_73) + var_74) + var_76) + var_78) + var_80) + var_83) + var_87) + var_88) + var_91) + var_96) + var_99) + var_100) + var_101) + var_104) + var_105) + var_106;
        (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((((((var_107 + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127) + var_128) + var_130) + var_131) + var_132) + var_134) + var_136) + var_139;
        (mem)[(global_invocation_id.x * 9u) + 8u] = (14u + 12u) + var_140;
        var_43 = (((((22u + mem[0u]) + var_142) + var_144) + var_145) + var_146) + var_150;
        var_35 = ((((((((mem[0u] + 14u) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171;
        var_154 = ((((((mem[(global_invocation_id.x * 9u) + 3u] + 16u) + var_178) + var_179) + var_180) + var_181) + var_182) + var_183;
        var_244 = (((((((((((((((((((mem[0u] + 24u) + var_212) + var_213) + var_215) + var_216) + var_217) + var_218) + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236) + var_240) + var_241;
        var_205 = (((((((((((var_242 + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258) + var_262) + var_263) + var_265;
        var_194 = ((((((((((((((((((mem[0u] + var_272) + var_1) + var_3) + var_6) + var_9) + var_11) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31;
        var_140 = 4u + var_32;
        (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((((((22u + var_33) + var_34) + var_35) + var_39) + var_40) + var_41) + var_42) + var_43) + var_44) + var_46) + var_48) + var_52) + var_54;
        var_258 = (((((((22u + mem[0u]) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127;
        var_212 = ((22u + var_128) + var_130) + var_131;
    }
}
	(mem)[(global_invocation_id.x * 9u) + 3u] = (((mem[0u] + mem[(global_invocation_id.x * 9u) + 8u]) + var_150) + var_151) + var_152;
	if (22u < mem[0u]) {
    for (var i_2: u32 = min(var_164, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
    }
}
	var_106 = ((((((mem[(global_invocation_id.x * 9u) + 8u] + var_228) + var_229) + var_230) + var_234) + var_235) + var_236) + var_240;
	if (mem[(global_invocation_id.x * 9u) + 8u] > 6u) {
    var_32 = ((((((((((((((var_242 + 0u) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258) + var_262) + var_263) + var_265) + var_267) + var_268;
} else {
    if (0u < var_165) {
        (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((mem[0u] + var_263) + var_265) + var_267) + var_268) + var_270) + var_271) + var_272) + var_1) + var_3;
        var_128 = (((((((var_6 + var_9) + var_11) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21;
        (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((2u + mem[(global_invocation_id.x * 9u) + 8u]) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31) + var_32;
        var_190 = var_68 + mem[0u];
        for (var i_3: u32 = min(22u, 10u); i_3 > 0u; i_3 = i_3 - 1u) {
            var_262 = (((((((((var_73 + mem[(global_invocation_id.x * 9u) + 3u]) + var_74) + var_76) + var_78) + var_80) + var_83) + var_87) + var_88) + var_91) + var_96;
            var_121 = (((((((((((var_105 + mem[(global_invocation_id.x * 9u) + 8u]) + var_106) + var_107) + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127;
        }
    }
}
	var_27 = ((((((((((((((((var_136 + var_139) + var_140) + var_142) + var_144) + var_145) + var_146) + var_150) + var_151) + var_152) + var_154) + var_155) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165;
	if (2u < mem[0u]) {
    var_185 = ((((((((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + 8u) + var_175) + var_176) + var_177) + var_178) + var_179) + var_180) + var_181) + var_182) + var_183) + var_184) + var_185) + var_186) + var_188) + var_189) + var_190) + var_192) + var_193) + var_194;
    if (10u < 0u) {
        (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((((var_240 + var_241) + var_242) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258;
        (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((((((((((var_262 + 16u) + var_263) + var_265) + var_267) + var_268) + var_270) + var_271) + var_272) + var_1) + var_3) + var_6) + var_9) + var_11) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21) + var_22;
        var_96 = (((var_23 + var_24) + var_26) + var_27) + var_28;
        (mem)[(global_invocation_id.x * 9u) + 8u] = (((((((var_31 + mem[0u]) + var_32) + var_33) + var_34) + var_35) + var_39) + var_40) + var_41;
    }
}
if (global_invocation_id.x == 0) {
    debug[0] = 42;
}
	var var_dummy: u32 = mem[(global_invocation_id.x * 9u) + 3u];
	var dummy_index_var: i32 = index_buf[0u];
	var dummy_data_var: u32 = data_buf[0u];
	var dummy_output_var: u32 = output_buf[0u].data;
}


